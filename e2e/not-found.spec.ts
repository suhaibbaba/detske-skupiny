import { expect, test } from "@playwright/test";
import { PATHS } from "./helpers";

/**
 * The point of these is the distinction between 404 and 500: an out-of-range
 * catalog depth or an unknown slug must not be allowed to throw.
 */
const NOT_FOUND_PATHS = [
  { name: "catalog with 5 segments", path: `${PATHS.catalog}/a/b/c/d/e` },
  { name: "catalog with 7 segments", path: `${PATHS.catalog}/a/b/c/d/e/f/g` },
  {
    name: "nonexistent article slug",
    path: `${PATHS.articles}/definitely-not-a-real-article-slug-xyz`,
  },
  {
    name: "nonexistent group slug",
    path: `${PATHS.groups}/definitely-not-a-real-group-slug-xyz`,
  },
  {
    name: "nonexistent catalog country",
    path: `${PATHS.catalog}/definitely-not-a-real-country-xyz`,
  },
];

test.describe("not found", () => {
  for (const { name, path } of NOT_FOUND_PATHS) {
    test(`${name} returns 404, never 500`, async ({ page }) => {
      const response = await page.goto(path);
      const status = response?.status() ?? 0;

      expect(
        status,
        `${path} returned ${status}; a server error here is a regression`,
      ).toBeLessThan(500);
      expect(status).toBe(404);
    });

    test(`${name} renders the not-found UI`, async ({ page }) => {
      await page.goto(path);

      await expect(page.getByText("404", { exact: true })).toBeVisible();
      // The not-found page offers a way back home.
      await expect(page.getByRole("link").first()).toBeVisible();
    });
  }

  test("the not-found page still renders the site chrome", async ({ page }) => {
    await page.goto(`${PATHS.catalog}/a/b/c/d/e`);

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});
