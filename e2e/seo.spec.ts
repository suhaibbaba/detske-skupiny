import { expect, test, type Page } from "@playwright/test";
import { firstCatalogHref, PATHS } from "./helpers";

/**
 * The SEO layer, asserted against the pages a user actually reaches.
 *
 * The crawler already checks that every page has a canonical and that any
 * structured data parses. This spec is the other half: that the values are the
 * right ones on the three page types where being wrong costs the most - a
 * school's business listing, an article's share card, and the catalog's
 * canonical under filters.
 *
 * Everything here is read from the rendered DOM rather than the response body,
 * because metadata on these routes is streamed in after the shell.
 */

/** The parsed contents of every `application/ld+json` block on the page. */
async function structuredData(page: Page): Promise<Record<string, unknown>[]> {
  const blocks = await page.$$eval(
    'script[type="application/ld+json"]',
    (scripts) => scripts.map((script) => script.textContent ?? ""),
  );

  return blocks.map((block) => JSON.parse(block));
}

const ofType = (blocks: Record<string, unknown>[], type: string) =>
  blocks.find((block) => block["@type"] === type);

async function metaContent(page: Page, selector: string) {
  return page.locator(selector).first().getAttribute("content");
}

async function canonical(page: Page) {
  return page.locator('link[rel="canonical"]').first().getAttribute("href");
}

/** Reach a school detail page the way a user does: home -> catalog -> card. */
async function openSchoolDetail(page: Page) {
  await page.goto(PATHS.home);
  const catalogHref = await firstCatalogHref(page);
  test.skip(!catalogHref, "no catalog links in this dataset");

  await page.goto(catalogHref!);
  await page.waitForLoadState("networkidle");

  const card = page.locator(`a[href^='${PATHS.groups}/']`).first();
  if ((await card.count()) === 0) {
    test.skip(true, "catalog has no school cards in this dataset");
  }

  const href = await card.getAttribute("href");
  await page.goto(href!);
  await page.waitForLoadState("networkidle");
  return href!;
}

test.describe("school detail structured data", () => {
  test("publishes a ChildCare listing naming the school", async ({ page }) => {
    await openSchoolDetail(page);

    const heading = (await page.locator("h1").first().innerText()).trim();
    const school = ofType(await structuredData(page), "ChildCare");

    expect(school, "no ChildCare block on the school page").toBeTruthy();
    expect(school!.name).toBe(heading);
    expect(school!.url).toBe(await canonical(page));
  });

  test("never emits an empty address or geo block", async ({ page }) => {
    await openSchoolDetail(page);
    const school = ofType(await structuredData(page), "ChildCare")!;

    // Present or absent, never present-and-empty: a PostalAddress with no
    // street asserts that the school has an address nobody wrote down.
    for (const key of ["address", "geo", "telephone", "email"] as const) {
      if (!(key in school)) continue;
      const value = school[key];
      if (typeof value === "string") {
        expect(value.trim(), `${key} is present but empty`).not.toBe("");
        continue;
      }
      const own = Object.keys(value as object).filter(
        (property) => !property.startsWith("@"),
      );
      expect(own.length, `${key} has only an @type`).toBeGreaterThan(0);
    }
  });

  test("mirrors the visible breadcrumb", async ({ page }) => {
    await openSchoolDetail(page);

    const visible = await page
      .locator('nav[aria-label="breadcrumb"] li')
      // The separators are list items too; only the labelled ones count.
      .evaluateAll((items) =>
        items
          .map((item) => item.textContent?.trim() ?? "")
          .filter((text) => text.length > 0 && text !== "/"),
      );

    const trail = ofType(await structuredData(page), "BreadcrumbList");
    test.skip(!trail, "no breadcrumb rendered on this page");

    const names = (trail!.itemListElement as { name: string }[]).map(
      (item) => item.name,
    );

    expect(names).toEqual(visible);
  });
});

test.describe("article metadata", () => {
  async function openFirstArticle(page: Page) {
    await page.goto(PATHS.articles);
    await page.waitForLoadState("networkidle");

    const link = page.locator(`a[href^='${PATHS.articles}/']`).first();
    if ((await link.count()) === 0) {
      test.skip(true, "no articles in this dataset");
    }

    await page.goto((await link.getAttribute("href"))!);
    await page.waitForLoadState("networkidle");
  }

  test("og:title matches the article's own heading", async ({ page }) => {
    await openFirstArticle(page);

    const heading = (await page.locator("h1").first().innerText()).trim();
    const ogTitle = await metaContent(page, 'meta[property="og:title"]');

    expect(ogTitle).toBe(heading);
    // The document title carries the site suffix from the layout template;
    // og:title deliberately does not.
    expect((await page.title()).startsWith(heading)).toBe(true);
  });

  test("is shared as an article, with a large image card", async ({ page }) => {
    await openFirstArticle(page);

    expect(await metaContent(page, 'meta[property="og:type"]')).toBe("article");
    expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe(
      "summary_large_image",
    );
    expect(await metaContent(page, 'meta[property="og:url"]')).toBe(
      await canonical(page),
    );

    const image = await metaContent(page, 'meta[property="og:image"]');
    expect(image, "no og:image").toBeTruthy();
    expect(image!).toMatch(/^https?:\/\//);
  });

  test("publishes an Article with the dates it has", async ({ page }) => {
    await openFirstArticle(page);

    const heading = (await page.locator("h1").first().innerText()).trim();
    const article = ofType(await structuredData(page), "Article");

    expect(article, "no Article block").toBeTruthy();
    expect(article!.headline).toBe(heading);
    expect(article!.author).toMatchObject({ "@type": "Organization" });
  });
});

test.describe("catalog canonical", () => {
  test("collapses every filter, search and page combination onto one URL", async ({
    page,
  }) => {
    await page.goto(PATHS.home);
    const href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links on the home page in this dataset");

    const clean = href!.split("?")[0];

    await page.goto(clean);
    await page.waitForLoadState("networkidle");
    const bare = await canonical(page);

    expect(bare, "catalog page has no canonical").toBeTruthy();
    expect(bare!.endsWith(clean)).toBe(true);

    // The same page under every kind of query state the catalog can produce.
    for (const query of [
      "?categories=whatever",
      "?tags=a&tags=b",
      "?name=slun",
      "?page=3",
      "?categories=x&tags=y&name=z&page=2",
    ]) {
      await page.goto(`${clean}${query}`);
      await page.waitForLoadState("networkidle");

      expect(await canonical(page), `canonical changed for ${query}`).toBe(
        bare,
      );
    }
  });

  test("links the English counterpart and defaults x-default to Czech", async ({
    page,
  }) => {
    await page.goto(PATHS.home);
    const href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links on the home page in this dataset");

    await page.goto(href!.split("?")[0]);
    await page.waitForLoadState("networkidle");

    const csAlternate = await page
      .locator('link[rel="alternate"][hreflang="cs"]')
      .first()
      .getAttribute("href");
    const xDefault = await page
      .locator('link[rel="alternate"][hreflang="x-default"]')
      .first()
      .getAttribute("href");

    expect(csAlternate).toBe(await canonical(page));
    expect(xDefault).toBe(csAlternate);
  });

  /**
   * The English alternate, when the dataset has one.
   *
   * The test above only ever asserted the Czech alternate and x-default, both
   * of which are the page's own path - so it passed for a long time while the
   * English link was never emitted at all. `translationPaths` projected
   * `"locale": _key`, and under document-internationalization v6 `_key` is a
   * random string with the language id in `language` instead, so the lookup by
   * locale never matched and every counterpart was dropped.
   *
   * Written as "if it is there, it must be right" rather than "it must be
   * there", because a dataset with no English translations is a legitimate
   * state and this spec runs against whatever the environment has.
   */
  test("any English alternate is absolute, on the English origin, and distinct", async ({
    page,
  }) => {
    await page.goto(PATHS.home);
    const href = await firstCatalogHref(page);
    test.skip(!href, "no catalog links on the home page in this dataset");

    await page.goto(href!.split("?")[0]);
    await page.waitForLoadState("networkidle");

    const enAlternate = await page
      .locator('link[rel="alternate"][hreflang="en"]')
      .first()
      .getAttribute("href")
      .catch(() => null);

    test.skip(!enAlternate, "no English counterpart in this dataset");

    const csAlternate = await page
      .locator('link[rel="alternate"][hreflang="cs"]')
      .first()
      .getAttribute("href");

    expect(enAlternate).toMatch(/^https?:\/\//);
    expect(new URL(enAlternate!).hostname).toBe(
      process.env.NEXT_PUBLIC_EN_DOMAIN,
    );
    expect(enAlternate).not.toBe(csAlternate);
  });
});

test.describe("robots and sitemap", () => {
  test("robots.txt allows crawling and points at the sitemap", async ({
    request,
    baseURL,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
    expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/);
    expect(baseURL).toBeTruthy();
  });

  test("sitemap.xml lists absolute URLs with hreflang alternates", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();
    const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );

    expect(locations.length, "sitemap is empty").toBeGreaterThan(0);
    for (const location of locations) {
      expect(location).toMatch(/^https?:\/\//);
    }
    expect(body).toContain('rel="alternate"');
    expect(body).toContain('hreflang="x-default"');
  });
});
