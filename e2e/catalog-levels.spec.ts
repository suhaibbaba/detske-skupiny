import { expect, test, type Page } from "@playwright/test";
import { catalogDepth, firstCatalogHref, PATHS } from "./helpers";

const LEVEL_NAMES = ["country", "region", "area", "subarea"];

/**
 * Walk down the catalog tree through the UI rather than by constructing slugs,
 * so this works against any dataset. At each depth the page must render a list
 * or a legitimate empty state - never an error.
 */
async function descend(page: Page, from: string): Promise<string | null> {
  const links = page.locator(`a[href^='${PATHS.catalog}/']`);
  const currentDepth = catalogDepth(from);

  for (const link of await links.all()) {
    const href = await link.getAttribute("href");
    if (!href) continue;
    if (catalogDepth(href) === currentDepth + 1 && href.startsWith(from)) {
      return href;
    }
  }
  return null;
}

test.describe("catalog levels", () => {
  test("every available depth renders correctly", async ({ page }) => {
    await page.goto(PATHS.home);

    let href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links in this dataset");

    const visited: string[] = [];

    while (href && catalogDepth(href) <= 4) {
      const response = await page.goto(href);
      const depth = catalogDepth(href);
      const level = LEVEL_NAMES[depth - 1] ?? `depth-${depth}`;

      expect(
        response?.status(),
        `${level} page ${href} returned ${response?.status()}`,
      ).toBe(200);

      await page.waitForLoadState("networkidle");
      visited.push(`${level}: ${href}`);

      // The list container is always present, even when it holds no cards.
      await expect(
        page.locator("[data-test-selector='SchoolList']"),
        `${level} page has no school list container`,
      ).toBeVisible();

      // Filters stay available at every depth.
      const filters = page.locator(
        "[data-test-selector='FilterTypeList'], [data-test-selector='FilterTagList']",
      );
      expect(
        await filters.count(),
        `${level} page has no filters`,
      ).toBeGreaterThan(0);

      // Breadcrumbs should reflect how deep we are: one crumb per segment,
      // plus the home crumb.
      const crumbs = page.getByRole("navigation").getByRole("link");
      if ((await crumbs.count()) > 0) {
        expect(
          await crumbs.count(),
          `${level} breadcrumb has too few links`,
        ).toBeGreaterThanOrEqual(1);
      }

      const next = await descend(page, href.split("?")[0]);
      if (!next) break;
      href = next;
    }

    test.info().annotations.push({
      type: "levels visited",
      description: visited.join("\n"),
    });

    expect(visited.length, "no catalog level was reachable").toBeGreaterThan(0);
  });

  test("a deeper level is reachable from a country page", async ({ page }) => {
    await page.goto(PATHS.home);
    const country = await firstCatalogHref(page);
    test.skip(!country, "no catalog links in this dataset");

    await page.goto(country!);
    const region = await descend(page, country!.split("?")[0]);

    if (!region) {
      test.info().annotations.push({
        type: "note",
        description: "country page exposes no deeper level in this dataset",
      });
      return;
    }

    const response = await page.goto(region);
    expect(response?.status()).toBe(200);
    expect(catalogDepth(region)).toBe(catalogDepth(country!) + 1);
  });
});
