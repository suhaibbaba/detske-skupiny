import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { firstCatalogHref, PATHS } from "./helpers";

/**
 * Only serious and critical violations fail the build. Everything axe finds is
 * printed either way, because the current violations are being fixed in a
 * later phase and the list is the deliverable.
 */
const FAIL_ON = ["serious", "critical"];

async function audit(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = results.violations
    .map(
      (violation) =>
        `[${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}\n` +
        `    nodes: ${violation.nodes.length}\n` +
        violation.nodes
          .slice(0, 3)
          .map((node) => `      - ${node.target.join(" ")}`)
          .join("\n"),
    )
    .join("\n");

  // Printed for every run so the backlog is visible even when the test passes.
  console.log(
    `\n=== axe: ${label} (${results.violations.length} violations) ===\n` +
      (summary || "  none"),
  );

  test.info().annotations.push({
    type: `axe:${label}`,
    description: summary || "none",
  });

  const blocking = results.violations.filter((violation) =>
    FAIL_ON.includes(violation.impact ?? ""),
  );

  expect(
    blocking.map((violation) => `${violation.id} (${violation.impact})`),
    `serious/critical a11y violations on ${label}:\n${summary}`,
  ).toEqual([]);
}

test.describe("accessibility", () => {
  test("home", async ({ page }) => {
    await page.goto(PATHS.home);
    await page.waitForLoadState("networkidle");
    await audit(page, "home");
  });

  test("catalog", async ({ page }) => {
    await page.goto(PATHS.home);
    const href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links in this dataset");

    await page.goto(href!);
    await page.waitForLoadState("networkidle");
    await audit(page, "catalog");
  });

  test("school detail", async ({ page }) => {
    await page.goto(PATHS.home);
    const href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links in this dataset");

    await page.goto(href!);
    await page.waitForLoadState("networkidle");

    const card = page.locator(`a[href^='${PATHS.groups}/']`).first();
    test.skip((await card.count()) === 0, "no school cards in this dataset");

    await page.goto((await card.getAttribute("href"))!);
    await page.waitForLoadState("networkidle");
    await audit(page, "school-detail");
  });
});
