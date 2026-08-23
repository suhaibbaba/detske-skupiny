import { expect, test } from "@playwright/test";
import { LOCALE, PATHS } from "./helpers";

test.describe("i18n", () => {
  test("the default domain serves the Czech locale", async ({ page }) => {
    await page.goto(PATHS.home);

    // If this fails, the domain mapping in playwright.config.ts is wrong and
    // every other spec is testing the English site.
    await expect(page.locator("html")).toHaveAttribute("lang", LOCALE);
  });

  test("navigation uses Czech path segments", async ({ page }) => {
    await page.goto(PATHS.home);

    const hrefs = await page.$$eval("a[href^='/']", (links) =>
      links.map((a) => a.getAttribute("href") ?? ""),
    );

    // The English segments must not appear on the Czech domain.
    const english = hrefs.filter((href) =>
      /^\/(catalog|articles|groups|cooperation|contact-us)(\/|$)/.test(href),
    );
    expect(english, `English paths on the Czech domain: ${english}`).toEqual(
      [],
    );
  });

  test("the language switcher points at the English domain", async ({
    page,
  }) => {
    await page.goto(PATHS.home);

    // Assert the target, never navigate - the English domain is a different
    // host and is not served by this dev server.
    const switcher = page.locator("[href*='en.'], [data-locale='en']").first();
    const hasSwitcherLink = (await switcher.count()) > 0;

    if (hasSwitcherLink) {
      const href = await switcher.getAttribute("href");
      expect(href).toContain("en.");
      return;
    }

    // The switcher is a MUI Select that redirects in JS rather than rendering
    // an anchor, so fall back to asserting the control exists and offers both
    // locales.
    const combobox = page.getByRole("combobox").first();
    await expect(combobox).toBeVisible();
    await combobox.click();

    const options = page.getByRole("option");
    await expect(options).toHaveCount(2);
    await expect(options.filter({ hasText: /English/i })).toHaveCount(1);
    await expect(options.filter({ hasText: /Čeština/i })).toHaveCount(1);
  });

  test("dates render in Czech format on an article", async ({ page }) => {
    await page.goto(PATHS.articles);

    const firstArticle = page
      .locator(`a[href^='${PATHS.articles}/']`)
      .first();
    if ((await firstArticle.count()) === 0) test.skip();

    await firstArticle.click();
    await page.waitForLoadState("domcontentloaded");

    // cs-CZ short months are lowercase with a trailing dot ("led", "úno"...);
    // en-US would render "Jan"/"Aug". Assert we are not seeing English months.
    const body = (await page.locator("body").innerText()).toLowerCase();
    const englishMonths =
      /\b(jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{2},\s+\d{4}/;
    expect(englishMonths.test(body)).toBe(false);
  });
});
