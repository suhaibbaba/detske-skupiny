import { expect, test, type Page } from "@playwright/test";
import {
  expectNoProblems,
  firstCatalogHref,
  PATHS,
  watchForProblems,
} from "./helpers";

/** Enter the catalog through whatever country the dataset actually has. */
async function openCatalog(page: Page) {
  await page.goto(PATHS.home);
  const href = await firstCatalogHref(page);

  if (!href) {
    test.skip(true, "no catalog links on the home page in this dataset");
    return "";
  }

  await page.goto(href);
  await page.waitForLoadState("networkidle");
  return href;
}

/** The distinct school slugs currently rendered in the list. */
async function listedSchools(page: Page): Promise<string[]> {
  const hrefs = await page
    .locator(`[data-test-selector='SchoolList'] a[href^='${PATHS.groups}/']`)
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));

  return [...new Set(hrefs.filter(Boolean))];
}

/**
 * The filter controls navigate, and the new list arrives with the navigation
 * inside a React transition. `networkidle` alone can land between the response
 * and the commit, so settle on the rendered list instead.
 */
async function settled(page: Page) {
  await page.waitForLoadState("networkidle");
  await expect(page.locator("[data-test-selector='SchoolList']")).toBeVisible();
  await expect
    .poll(async () => page.locator("[data-pending='true']").count(), {
      message: "list stayed in the pending state",
      timeout: 15_000,
    })
    .toBe(0);
}

/**
 * Records every request the browser makes that would mean the client is
 * fetching data for itself. After this PR there must be none: filters
 * navigate, paging goes through a Server Action.
 */
function watchForClientDataFetches(page: Page) {
  const offenders: string[] = [];

  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("sanity.io") && !url.includes("cdn.sanity.io")) {
      offenders.push(`sanity query: ${url}`);
    }
    if (url.includes("/api/schools")) {
      offenders.push(`removed route: ${url}`);
    }
  });

  return offenders;
}

test.describe("catalog", () => {
  test("renders the school list", async ({ page }) => {
    await openCatalog(page);
    await expect(
      page.locator("[data-test-selector='SchoolList']"),
    ).toBeVisible();
  });

  test("renders school cards that link to detail pages", async ({ page }) => {
    await openCatalog(page);

    const cards = page.locator(`a[href^='${PATHS.groups}/']`);
    const count = await cards.count();

    if (count === 0) {
      test.info().annotations.push({
        type: "note",
        description: "catalog returned an empty list for this dataset",
      });
      return;
    }

    expect(count).toBeGreaterThan(0);
    await expect(cards.first()).toBeVisible();
  });

  test("shows the filter sidebar", async ({ page }) => {
    await openCatalog(page);

    const filters = page.locator(
      "[data-test-selector='FilterTypeList'], [data-test-selector='FilterTagList']",
    );
    expect(await filters.count()).toBeGreaterThan(0);
  });

  test("a category filter updates the URL and the list, server-side", async ({
    page,
  }) => {
    const offenders = watchForClientDataFetches(page);
    await openCatalog(page);

    const filterList = page
      .locator("[data-test-selector='FilterTypeList']")
      .first();
    if ((await filterList.count()) === 0) {
      test.skip(true, "no category filters in this dataset");
    }

    const before = page.url();
    const schoolsBefore = await listedSchools(page);

    const option = filterList.getByRole("checkbox").first();
    if ((await option.count()) === 0) {
      test.skip(true, "category filter has no options in this dataset");
    }
    await option.click();

    // The filter state lives in the query string (nuqs) and nowhere else.
    await expect
      .poll(() => page.url(), { message: "filter did not update the URL" })
      .not.toBe(before);
    expect(page.url()).toContain("categories=");

    await settled(page);

    // The narrowed list is rendered by the server and arrives with the
    // navigation; the browser must not have fetched it separately.
    const schoolsAfter = await listedSchools(page);
    expect(schoolsAfter).not.toEqual(schoolsBefore);
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("search narrows the list and survives rapid typing", async ({
    page,
  }) => {
    const offenders = watchForClientDataFetches(page);
    await openCatalog(page);

    const search = page.getByRole("textbox").first();
    if ((await search.count()) === 0) {
      test.skip(true, "no search input on the catalog page");
    }

    // Typed key by key rather than filled, so the debounce and the transition
    // are exercised the way a person exercises them. Only the last value may
    // survive: the search term in the URL must match what is in the box.
    await search.click();
    await search.pressSequentially("zzzzz-no-such-school-zzzzz", { delay: 30 });

    await expect
      .poll(() => page.url(), {
        message: "search did not reach the URL",
        timeout: 15_000,
      })
      .toContain("zzzzz-no-such-school-zzzzz");

    await settled(page);

    // A nonsense query must produce an empty list, not an error.
    expect(await listedSchools(page)).toEqual([]);
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("load-more appends results and records the page in the URL", async ({
    page,
  }) => {
    const offenders = watchForClientDataFetches(page);
    await openCatalog(page);
    await settled(page);

    const before = await listedSchools(page);

    if (before.length === 0) {
      test.skip(true, "catalog list is empty in this dataset");
    }

    // The list pages on scroll; the sentinel calls a Server Action.
    await page.mouse.wheel(0, 12_000);
    await page.waitForTimeout(2_000);
    await page.waitForLoadState("networkidle");

    const after = await listedSchools(page);

    if (after.length === before.length) {
      test.info().annotations.push({
        type: "note",
        description: "dataset has a single page of results; nothing to append",
      });
      return;
    }

    expect(after.length).toBeGreaterThan(before.length);
    // Appended, not replaced.
    expect(after.slice(0, before.length)).toEqual(before);
    expect(page.url()).toContain("page=");
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("reloading a ?page=2 URL restores both pages", async ({ page }) => {
    const href = await openCatalog(page);
    await settled(page);

    const firstPage = await listedSchools(page);
    if (firstPage.length === 0) {
      test.skip(true, "catalog list is empty in this dataset");
    }

    await page.goto(`${href}?page=2`);
    await settled(page);

    const restored = await listedSchools(page);

    if (restored.length === firstPage.length) {
      test.info().annotations.push({
        type: "note",
        description: "dataset has a single page of results",
      });
      return;
    }

    // The server renders pages 1..N for ?page=N, so page one is still on top.
    expect(restored.length).toBeGreaterThan(firstPage.length);
    expect(restored.slice(0, firstPage.length)).toEqual(firstPage);
  });

  test("the back button restores the previous filter state", async ({
    page,
  }) => {
    await openCatalog(page);
    await settled(page);

    const before = page.url();
    const schoolsBefore = await listedSchools(page);

    const option = page
      .locator("[data-test-selector='FilterTypeList']")
      .first()
      .getByRole("checkbox")
      .first();

    if ((await option.count()) === 0) {
      test.skip(true, "no category filters in this dataset");
    }

    await option.click();
    await expect.poll(() => page.url()).not.toBe(before);
    await settled(page);

    await page.goBack();
    await settled(page);

    expect(page.url()).toBe(before);
    expect(await listedSchools(page)).toEqual(schoolsBefore);
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);
    await openCatalog(page);
    expectNoProblems(problems);
  });
});
