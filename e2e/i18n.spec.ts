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

  /**
   * The switcher has to offer the *equivalent* page, not the home page.
   *
   * It used to build `protocol//domain/` and nothing else - every visitor on
   * every page landed on the English home page, however deep they were - while
   * the function's own comment claimed it preserved "path, search params, and
   * hash". The fallback chain now is: the page's declared hreflang alternate,
   * then a segment-by-segment translation of the path, then home.
   *
   * The English domain is a different host and is not served by this dev
   * server, so this asserts what the switcher *would* navigate to rather than
   * following it: the click handler is stubbed by overriding the assignment
   * to `window.location.href`.
   */
  test("the language switcher targets the equivalent page, not the home page", async ({
    page,
  }) => {
    await page.goto(PATHS.contact);
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => {
      const target = { value: "" };
      Object.defineProperty(window, "__switchTarget", { value: target });
      Object.defineProperty(window.location, "href", {
        configurable: true,
        get: () => window.location.toString(),
        set: (url: string) => {
          target.value = url;
        },
      });
    });

    const combobox = page.getByRole("combobox").first();
    await combobox.click();
    await page
      .getByRole("option")
      .filter({ hasText: /English/i })
      .click();

    const target = await page.evaluate(
      () =>
        (window as unknown as { __switchTarget: { value: string } })
          .__switchTarget.value,
    );

    expect(target, "the switcher navigated nowhere").not.toBe("");
    expect(new URL(target).hostname).toBe(process.env.NEXT_PUBLIC_EN_DOMAIN);
    expect(
      new URL(target).pathname,
      "landed on the home page instead of the English contact page",
    ).toBe("/contact-us");
  });

  test("dates render in Czech format on an article", async ({ page }) => {
    await page.goto(PATHS.articles);

    const firstArticle = page.locator(`a[href^='${PATHS.articles}/']`).first();
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
