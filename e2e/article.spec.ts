import { expect, test, type Page } from "@playwright/test";
import {
  expectNoProblems,
  PATHS,
  watchForProblems,
} from "./helpers";

async function openFirstArticle(page: Page) {
  await page.goto(PATHS.articles);
  await page.waitForLoadState("networkidle");

  const link = page.locator(`a[href^='${PATHS.articles}/']`).first();
  if ((await link.count()) === 0) {
    test.skip(true, "no articles in this dataset");
  }

  const href = await link.getAttribute("href");
  const response = await page.goto(href!);
  await page.waitForLoadState("networkidle");
  return { href: href!, status: response?.status() };
}

test.describe("articles index", () => {
  test("loads with a 200 and one h1", async ({ page }) => {
    const response = await page.goto(PATHS.articles);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("lists articles that link to detail pages", async ({ page }) => {
    await page.goto(PATHS.articles);
    await page.waitForLoadState("networkidle");

    const links = page.locator(`a[href^='${PATHS.articles}/']`);
    if ((await links.count()) === 0) {
      test.info().annotations.push({
        type: "note",
        description: "no articles in this dataset",
      });
      return;
    }
    await expect(links.first()).toBeVisible();
  });
});

test.describe("article detail", () => {
  test("opens from the index with a 200", async ({ page }) => {
    const { status } = await openFirstArticle(page);
    expect(status).toBe(200);
  });

  test("renders a title", async ({ page }) => {
    await openFirstArticle(page);

    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0);
  });

  test("has a non-empty document title", async ({ page }) => {
    await openFirstArticle(page);
    expect((await page.title()).trim()).not.toBe("");
  });

  test("every image actually loaded", async ({ page }) => {
    await openFirstArticle(page);

    // naturalWidth is 0 for an image that failed to load - a broken asset
    // reference renders as an empty box rather than throwing.
    const broken = await page.$$eval("img", (images) =>
      images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );

    expect(broken, `images that failed to load:\n${broken.join("\n")}`).toEqual(
      [],
    );
  });

  test("every image has an alt attribute", async ({ page }) => {
    await openFirstArticle(page);

    const missing = await page.$$eval("img", (images) =>
      images
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );
    expect(missing).toEqual([]);
  });

  test("internal rich-text links resolve, not 404", async ({ page }) => {
    await openFirstArticle(page);

    const hrefs = await page.$$eval("a[href^='/']", (links) =>
      Array.from(
        new Set(
          links
            .map((a) => a.getAttribute("href") ?? "")
            .filter((href) => href && !href.startsWith("//")),
        ),
      ),
    );

    // Cap the fan-out: the crawler covers the site exhaustively, this is a
    // spot check on the links a single article actually renders.
    const broken: string[] = [];
    for (const href of hrefs.slice(0, 25)) {
      const response = await page.request.get(href);
      if (response.status() >= 400) {
        broken.push(`${href} -> ${response.status()}`);
      }
    }

    expect(broken, `broken internal links:\n${broken.join("\n")}`).toEqual([]);
  });

  test("rich text renders block content, not raw markup", async ({ page }) => {
    await openFirstArticle(page);

    const body = await page.locator("body").innerText();
    // Portable Text that failed to render tends to leak its object shape.
    expect(body).not.toContain("_type");
    expect(body).not.toContain("[object Object]");
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);
    await openFirstArticle(page);
    expectNoProblems(problems);
  });
});
