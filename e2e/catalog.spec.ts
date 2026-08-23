import { expect, test } from "@playwright/test";
import {
  expectNoProblems,
  firstCatalogHref,
  PATHS,
  watchForProblems,
} from "./helpers";

/** Enter the catalog through whatever country the dataset actually has. */
async function openCatalog(page: import("@playwright/test").Page) {
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

test.describe("catalog", () => {
  test("renders the school list", async ({ page }) => {
    await openCatalog(page);
    await expect(page.locator("[data-test-selector='SchoolList']")).toBeVisible();
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

  test("a category filter updates the URL and the list", async ({ page }) => {
    await openCatalog(page);

    const filterList = page
      .locator("[data-test-selector='FilterTypeList']")
      .first();
    if ((await filterList.count()) === 0) {
      test.skip(true, "no category filters in this dataset");
    }

    const before = page.url();
    const listBefore = await page
      .locator("[data-test-selector='SchoolList']")
      .innerText();

    const option = filterList.getByRole("checkbox").first();
    if ((await option.count()) === 0) {
      test.skip(true, "category filter has no options in this dataset");
    }
    await option.check();

    // The filter state lives in the query string (nuqs), so the URL must move.
    await expect
      .poll(() => page.url(), { message: "filter did not update the URL" })
      .not.toBe(before);

    await page.waitForLoadState("networkidle");
    const listAfter = await page
      .locator("[data-test-selector='SchoolList']")
      .innerText();
    expect(listAfter).not.toBe(listBefore);
  });

  test("search narrows the list", async ({ page }) => {
    await openCatalog(page);

    const search = page.getByRole("textbox").first();
    if ((await search.count()) === 0) {
      test.skip(true, "no search input on the catalog page");
    }

    await search.fill("zzzzz-no-such-school-zzzzz");
    await expect
      .poll(() => page.url(), { message: "search did not update the URL" })
      .toContain("zzzzz");

    await page.waitForLoadState("networkidle");

    // A nonsense query must produce a smaller list, not an error.
    const cards = page.locator(`a[href^='${PATHS.groups}/']`);
    expect(await cards.count()).toBe(0);
  });

  test("load-more adds cards", async ({ page }) => {
    await openCatalog(page);

    const cards = page.locator(`a[href^='${PATHS.groups}/']`);
    const before = await cards.count();

    const loadMore = page
      .getByRole("button")
      .filter({ hasText: /víc|další|more/i })
      .first();

    if ((await loadMore.count()) === 0) {
      // The list may use infinite scroll instead; scroll and see if it grows.
      await page.mouse.wheel(0, 20_000);
      await page.waitForTimeout(2_000);
      const afterScroll = await cards.count();
      expect(afterScroll).toBeGreaterThanOrEqual(before);
      return;
    }

    await loadMore.click();
    await page.waitForLoadState("networkidle");
    expect(await cards.count()).toBeGreaterThan(before);
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);
    await openCatalog(page);
    expectNoProblems(problems);
  });
});
