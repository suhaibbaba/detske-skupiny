import { expect, test } from "@playwright/test";
import { expectNoProblems, PATHS, watchForProblems } from "./helpers";

/**
 * Every remaining static route from src/routes/routes.ts. The catalog,
 * articles and groups routes have dedicated specs; these are the ones whose
 * only requirement is "renders its zones without erroring".
 */
const STATIC_ROUTES = [
  { name: "cooperation", path: PATHS.cooperation },
  { name: "contact", path: PATHS.contact },
];

test.describe("static content routes", () => {
  for (const { name, path } of STATIC_ROUTES) {
    test(`${name} loads with a 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });

    test(`${name} renders a single h1 and a title`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).trim()).not.toBe("");
    });

    test(`${name} renders without console errors`, async ({ page }) => {
      const problems = watchForProblems(page);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expectNoProblems(problems);
    });
  }

  test("cooperation renders its content zones", async ({ page }) => {
    await page.goto(PATHS.cooperation);
    await page.waitForLoadState("networkidle");

    // The page is assembled from Sanity sections; at least one of the known
    // zones should be present. Which ones depends on the dataset.
    const zones = page.locator(
      "[data-test-selector='OurPricing'], [data-test-selector='ListOfSchools'], [data-test-selector='PreschoolCard']",
    );
    expect(await zones.count()).toBeGreaterThan(0);
  });
});
