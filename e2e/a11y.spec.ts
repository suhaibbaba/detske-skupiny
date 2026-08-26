import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { firstCatalogHref, PATHS } from "./helpers";

/**
 * The accessibility gate.
 *
 * A serious or critical violation fails the build.
 *
 * Moderate and minor are printed rather than failed. They are not a free pass;
 * they are a backlog with a lower bar, and keeping them visible in every run is
 * what stops them turning into a surprise later. Promote them when the list is
 * short enough to be worth clearing.
 */
const FAIL_ON = ["serious", "critical"];

type Violation = Awaited<
  ReturnType<AxeBuilder["analyze"]>
>["violations"][number];

const describeViolations = (violations: Violation[]) =>
  violations
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

async function audit(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter((violation) =>
    FAIL_ON.includes(violation.impact ?? ""),
  );
  const advisory = results.violations.filter(
    (violation) => !FAIL_ON.includes(violation.impact ?? ""),
  );

  // Printed on every run, pass or fail, so the moderate/minor list stays
  // visible rather than only appearing when something breaks.
  console.log(
    `\n=== axe: ${label} ===\n` +
      `  blocking (serious/critical): ${blocking.length}\n` +
      `  advisory (moderate/minor):   ${advisory.length}\n` +
      (advisory.length ? `${describeViolations(advisory)}\n` : ""),
  );

  test.info().annotations.push({
    type: `axe:${label}`,
    description: describeViolations(advisory) || "none",
  });

  expect(
    blocking.map((violation) => `${violation.id} (${violation.impact})`),
    `serious/critical a11y violations on ${label}:\n${describeViolations(blocking)}`,
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

  /**
   * The contact page is the only form on the site, so it is the only place
   * axe's label, name and error-message rules have anything to check.
   */
  test("contact", async ({ page }) => {
    await page.goto(PATHS.contact);
    await page.waitForLoadState("networkidle");
    await audit(page, "contact");
  });

  test("groups index", async ({ page }) => {
    await page.goto(PATHS.groups);
    await page.waitForLoadState("networkidle");
    await audit(page, "groups-index");
  });

  /**
   * An article is the one page built from editor-authored rich text, so it is
   * where heading order and link naming are decided by content rather than by
   * a component - which is exactly the combination that regresses quietly.
   */
  test("article", async ({ page }) => {
    await page.goto(PATHS.articles);
    await page.waitForLoadState("networkidle");

    const article = page.locator(`a[href^='${PATHS.articles}/']`).first();
    test.skip((await article.count()) === 0, "no articles in this dataset");

    await page.goto((await article.getAttribute("href"))!);
    await page.waitForLoadState("networkidle");
    await audit(page, "article");
  });

  /**
   * Not an axe rule, so it gets its own test: the skip link has to be the
   * first thing a keyboard reaches, and it has to move focus into the content
   * rather than only scrolling to it.
   */
  test("skip link is the first tab stop and moves focus", async ({ page }) => {
    await page.goto(PATHS.home);
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Tab");

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");

    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedTag).toBe("MAIN");
  });
});
