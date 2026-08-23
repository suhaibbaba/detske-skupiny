import { expect, test } from "@playwright/test";
import {
  expectNoProblems,
  LOCALE,
  PATHS,
  watchForProblems,
} from "./helpers";

test.describe("home", () => {
  test("loads with a 200 and renders the page shell", async ({ page }) => {
    const response = await page.goto(PATHS.home);

    expect(response?.status()).toBe(200);
    await expect(page.locator("[data-test-selector='home-page']")).toBeVisible();
  });

  test("has exactly one h1 and a non-empty title", async ({ page }) => {
    await page.goto(PATHS.home);

    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).trim()).not.toBe("");
  });

  test("declares the Czech locale", async ({ page }) => {
    await page.goto(PATHS.home);
    await expect(page.locator("html")).toHaveAttribute("lang", LOCALE);
  });

  test("renders header navigation that links somewhere", async ({ page }) => {
    await page.goto(PATHS.home);

    const header = page.getByRole("banner");
    await expect(header).toBeVisible();

    const navLinks = header.getByRole("link");
    expect(await navLinks.count()).toBeGreaterThan(0);

    for (const link of await navLinks.all()) {
      const href = await link.getAttribute("href");
      expect(href, "a header link has no href").toBeTruthy();
    }
  });

  test("renders footer links", async ({ page }) => {
    await page.goto(PATHS.home);

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    expect(await footer.getByRole("link").count()).toBeGreaterThan(0);
  });

  test("every image has an alt attribute", async ({ page }) => {
    await page.goto(PATHS.home);
    await page.waitForLoadState("networkidle");

    const missing = await page.$$eval("img", (images) =>
      images
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.getAttribute("src") ?? "(no src)"),
    );

    expect(missing, `images without alt:\n${missing.join("\n")}`).toEqual([]);
  });

  test("loads with no console errors", async ({ page }) => {
    const problems = watchForProblems(page);

    await page.goto(PATHS.home);
    await page.waitForLoadState("networkidle");

    expectNoProblems(problems);
  });
});
