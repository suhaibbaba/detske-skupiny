import { expect, test } from "@playwright/test";
import { expectNoProblems, PATHS, watchForProblems } from "./helpers";

test.describe("groups index", () => {
  test("loads and renders a listing", async ({ page }) => {
    const response = await page.goto(PATHS.groups);

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("cards link to group detail pages", async ({ page }) => {
    await page.goto(PATHS.groups);
    await page.waitForLoadState("networkidle");

    const detailLinks = page.locator(`a[href^='${PATHS.groups}/']`);
    const count = await detailLinks.count();

    // An empty dataset is a valid state; if there are cards they must link out.
    if (count === 0) {
      test.info().annotations.push({
        type: "note",
        description: "no group cards in this dataset",
      });
      return;
    }

    for (const link of await detailLinks.all()) {
      const href = await link.getAttribute("href");
      expect(href).toMatch(new RegExp(`^${PATHS.groups}/[^/]+`));
    }
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);
    await page.goto(PATHS.groups);
    await page.waitForLoadState("networkidle");
    expectNoProblems(problems);
  });
});
