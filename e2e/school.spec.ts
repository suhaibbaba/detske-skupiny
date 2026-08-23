import { expect, test } from "@playwright/test";
import {
  expectNoProblems,
  firstCatalogHref,
  PATHS,
  watchForProblems,
} from "./helpers";

/** Reach a school detail page the way a user does: home -> catalog -> card. */
async function openSchoolDetail(page: import("@playwright/test").Page) {
  await page.goto(PATHS.home);
  const catalogHref = await firstCatalogHref(page);
  test.skip(!catalogHref, "no catalog links in this dataset");

  await page.goto(catalogHref!);
  await page.waitForLoadState("networkidle");

  const card = page.locator(`a[href^='${PATHS.groups}/']`).first();
  if ((await card.count()) === 0) {
    test.skip(true, "catalog has no school cards in this dataset");
  }

  const href = await card.getAttribute("href");
  await page.goto(href!);
  await page.waitForLoadState("networkidle");
  return href!;
}

test.describe("school detail", () => {
  test("is reachable from the catalog and returns 200", async ({ page }) => {
    const href = await openSchoolDetail(page);
    expect(href).toMatch(new RegExp(`^${PATHS.groups}/`));
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("shows the school name", async ({ page }) => {
    await openSchoolDetail(page);

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0);
  });

  test("shows an address", async ({ page }) => {
    await openSchoolDetail(page);

    // The info cards carry the address and contact rows.
    const infoCards = page.locator("[data-test-selector='info-card']");
    expect(await infoCards.count()).toBeGreaterThan(0);
  });

  test("renders a map container", async ({ page }) => {
    await openSchoolDetail(page);

    // The map mounts into a canvas; mapbox-gl needs a moment to attach.
    const map = page.locator("canvas, .maplibregl-map, .mapboxgl-map");
    await expect(map.first()).toBeAttached({ timeout: 20_000 });
  });

  test("every image has an alt attribute", async ({ page }) => {
    await openSchoolDetail(page);

    const missing = await page.$$eval("img", (images) =>
      images
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );
    expect(missing, `images without alt:\n${missing.join("\n")}`).toEqual([]);
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);
    await openSchoolDetail(page);
    expectNoProblems(problems);
  });
});
