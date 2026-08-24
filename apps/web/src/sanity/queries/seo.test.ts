import { describe, expect, it } from "vitest";
import { evaluate, parse } from "groq-js";

import {
  catalogNodeQuery,
  searchCountrySlugQuery,
  sitemapQuery,
  type CatalogSitemapEntry,
  type SitemapContent,
} from "@/sanity/queries/seo";
import { FilterTypes } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";

/**
 * The sitemap and the hreflang pairs, run against a real GROQ engine.
 *
 * Two things here cannot be checked any other way short of a live dataset.
 * The first is the `translation.metadata` join: the internationalization
 * plugin stores the cs<->en pairing in a separate document rather than on the
 * documents themselves, so getting it wrong produces no error - just a sitemap
 * with no alternates, which looks fine. The second is the count filter that
 * keeps empty catalog levels out; an off-by-one there either publishes thin
 * pages or silently drops real ones.
 *
 * The dataset below is bilingual on purpose, and deliberately lopsided: one
 * school and one article exist in Czech only, and one subarea has no schools.
 * Those are the cases the assertions are about.
 */
const dataset = [
  // ---------------------------------------------------------------- geography
  {
    _id: "country-cz",
    _type: "countries",
    name: "Cesko",
    slug: { current: "cesko" },
    language: "cs",
    orderRank: "a",
    _updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    _id: "country-cz-en",
    _type: "countries",
    name: "Czech Republic",
    slug: { current: "czech-republic" },
    language: "en",
    orderRank: "a",
    _updatedAt: "2024-01-01T00:00:00Z",
  },

  {
    _id: "region-praha",
    _type: "regions",
    name: "Praha",
    slug: { current: "praha" },
    country: { _ref: "country-cz" },
    language: "cs",
    orderRank: "a",
    _updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    _id: "region-praha-en",
    _type: "regions",
    name: "Prague",
    slug: { current: "prague" },
    country: { _ref: "country-cz-en" },
    language: "en",
    orderRank: "a",
    _updatedAt: "2024-02-01T00:00:00Z",
  },
  // A region with no schools anywhere under it - must not reach the sitemap.
  {
    _id: "region-empty",
    _type: "regions",
    name: "Prazdny kraj",
    slug: { current: "prazdny-kraj" },
    country: { _ref: "country-cz" },
    language: "cs",
    orderRank: "b",
    _updatedAt: "2024-02-01T00:00:00Z",
  },

  {
    _id: "area-praha-1",
    _type: "areas",
    name: "Praha 1",
    slug: { current: "praha-1" },
    region: { _ref: "region-praha" },
    language: "cs",
    orderRank: "a",
    _updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    _id: "area-praha-1-en",
    _type: "areas",
    name: "Prague 1",
    slug: { current: "prague-1" },
    region: { _ref: "region-praha-en" },
    language: "en",
    orderRank: "a",
    _updatedAt: "2024-03-01T00:00:00Z",
  },

  {
    _id: "subarea-mala-strana",
    _type: "subareas",
    name: "Mala Strana",
    slug: { current: "mala-strana" },
    area: { _ref: "area-praha-1" },
    language: "cs",
    orderRank: "a",
    _updatedAt: "2024-04-01T00:00:00Z",
  },
  // No school points at this one; it is the "empty subarea" case.
  {
    _id: "subarea-prazdna",
    _type: "subareas",
    name: "Prazdna",
    slug: { current: "prazdna" },
    area: { _ref: "area-praha-1" },
    language: "cs",
    orderRank: "b",
    _updatedAt: "2024-04-01T00:00:00Z",
  },

  // ------------------------------------------------------------------ schools
  {
    _id: "school-1",
    _type: "schools",
    name: "Skolka Jedna",
    slug: { current: "skolka-jedna" },
    area: { _ref: "area-praha-1" },
    subarea: { _ref: "subarea-mala-strana" },
    language: "cs",
    _updatedAt: "2024-05-01T00:00:00Z",
  },
  {
    _id: "school-1-en",
    _type: "schools",
    name: "Nursery One",
    slug: { current: "nursery-one" },
    area: { _ref: "area-praha-1-en" },
    language: "en",
    _updatedAt: "2024-05-01T00:00:00Z",
  },
  // Czech only - it must appear with no `en` alternate rather than be dropped.
  {
    _id: "school-2",
    _type: "schools",
    name: "Skolka Dva",
    slug: { current: "skolka-dva" },
    area: { _ref: "area-praha-1" },
    language: "cs",
    _updatedAt: "2024-05-02T00:00:00Z",
  },
  // A draft must never be listed.
  {
    _id: "drafts.school-3",
    _type: "schools",
    name: "Skolka Tri",
    slug: { current: "skolka-tri" },
    area: { _ref: "area-praha-1" },
    language: "cs",
    _updatedAt: "2024-05-03T00:00:00Z",
  },

  // ----------------------------------------------------------------- articles
  {
    _id: "blog-1",
    _type: "blogs",
    title: "Clanek",
    slug: { current: "clanek" },
    language: "cs",
    _updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    _id: "blog-1-en",
    _type: "blogs",
    title: "Article",
    slug: { current: "article" },
    language: "en",
    _updatedAt: "2024-06-01T00:00:00Z",
  },

  // ------------------------------------------------- translation.metadata rows
  ...[
    ["country-cz", "country-cz-en"],
    ["region-praha", "region-praha-en"],
    ["area-praha-1", "area-praha-1-en"],
    ["school-1", "school-1-en"],
    ["blog-1", "blog-1-en"],
  ].map(([cs, en], index) => ({
    _id: `tm-${index}`,
    _type: "translation.metadata",
    translations: [
      { _key: "cs", value: { _ref: cs } },
      { _key: "en", value: { _ref: en } },
    ],
  })),
];

async function run(query: string, params: Record<string, unknown> = {}) {
  const tree = parse(query);
  const result = await evaluate(tree, { dataset, params });
  return result.get();
}

const runSitemap = (locale: string) =>
  run(sitemapQuery, { locale }) as Promise<SitemapContent>;

const byPath = (entries: { path: string }[]) =>
  entries.map((entry) => entry.path).sort();

const pathFor = (
  entry: { translations?: { locale: string; path: string | null }[] | null },
  locale: string,
) => entry.translations?.find((t) => t.locale === locale)?.path ?? null;

describe("every exported SEO query is valid GROQ", () => {
  it.each([
    ["sitemapQuery", sitemapQuery],
    ["catalogNodeQuery", catalogNodeQuery],
    ["searchCountrySlugQuery", searchCountrySlugQuery],
  ])("%s parses", (_name, query) => {
    expect(() => parse(query)).not.toThrow();
  });

  it("has no unexpanded template placeholder left in any query", () => {
    for (const [name, query] of [
      ["sitemapQuery", sitemapQuery],
      ["catalogNodeQuery", catalogNodeQuery],
      ["searchCountrySlugQuery", searchCountrySlugQuery],
    ] as const) {
      expect(query, `${name} contains an unexpanded \${...}`).not.toMatch(
        /\$\{/,
      );
    }
  });
});

describe("sitemap content", () => {
  it("lists every published school in the requested locale only", async () => {
    const cs = await runSitemap("cs");
    const en = await runSitemap("en");

    expect(byPath(cs.schools)).toEqual(["skolka-dva", "skolka-jedna"]);
    expect(byPath(en.schools)).toEqual(["nursery-one"]);
  });

  it("carries _updatedAt so lastModified is the document's own", async () => {
    const cs = await runSitemap("cs");
    const school = cs.schools.find((s) => s.path === "skolka-jedna")!;

    expect(school.updatedAt).toBe("2024-05-01T00:00:00Z");
  });

  it("pairs a school with its counterpart in the other locale", async () => {
    const cs = await runSitemap("cs");
    const paired = cs.schools.find((s) => s.path === "skolka-jedna")!;
    const czechOnly = cs.schools.find((s) => s.path === "skolka-dva")!;

    expect(pathFor(paired, "en")).toBe("nursery-one");
    expect(pathFor(paired, "cs")).toBe("skolka-jedna");
    // Nothing to pair with: no alternate rather than a link to a 404.
    expect(czechOnly.translations ?? null).toBeNull();
  });

  it("pairs an article both ways", async () => {
    const cs = await runSitemap("cs");
    const en = await runSitemap("en");

    expect(byPath(cs.articles)).toEqual(["clanek"]);
    expect(pathFor(cs.articles[0], "en")).toBe("article");
    expect(pathFor(en.articles[0], "cs")).toBe("clanek");
  });

  it("composes the full catalog path at every level", async () => {
    const cs = await runSitemap("cs");

    expect(byPath(cs.catalog)).toEqual([
      "/cesko",
      "/cesko/praha",
      "/cesko/praha/praha-1",
      "/cesko/praha/praha-1/mala-strana",
    ]);
  });

  it("drops catalog levels with no schools under them", async () => {
    const cs = await runSitemap("cs");
    const paths = byPath(cs.catalog);

    expect(paths).not.toContain("/cesko/prazdny-kraj");
    expect(paths).not.toContain("/cesko/praha/praha-1/prazdna");
  });

  it("reports the count that decided each catalog level", async () => {
    const cs = await runSitemap("cs");
    const counts = Object.fromEntries(
      cs.catalog.map((entry: CatalogSitemapEntry) => [
        entry.level,
        entry.schoolCount,
      ]),
    );

    expect(counts).toEqual({
      country: 2,
      region: 2,
      area: 2,
      subarea: 1,
    });
  });

  it("pairs a catalog level with the counterpart's own composed path", async () => {
    const cs = await runSitemap("cs");
    const region = cs.catalog.find((entry) => entry.path === "/cesko/praha")!;
    const area = cs.catalog.find(
      (entry) => entry.path === "/cesko/praha/praha-1",
    )!;

    expect(pathFor(region, "en")).toBe("/czech-republic/prague");
    expect(pathFor(area, "en")).toBe("/czech-republic/prague/prague-1");
  });

  it("never lists a draft", async () => {
    const cs = await runSitemap("cs");
    expect(byPath(cs.schools)).not.toContain("skolka-tri");
  });
});

describe("catalogNodeQuery", () => {
  it("resolves a region and its counterpart path", async () => {
    const node = (await run(catalogNodeQuery, {
      type: "regions",
      slug: "praha",
      locale: "cs",
    })) as {
      name: string;
      path: string;
      translations: { locale: string; path: string }[];
    };

    expect(node.name).toBe("Praha");
    expect(node.path).toBe("/cesko/praha");
    expect(pathFor(node, "en")).toBe("/czech-republic/prague");
  });

  it("is keyed by level, so slugs that collide across levels do not", async () => {
    const asArea = await run(catalogNodeQuery, {
      type: "areas",
      slug: "praha",
      locale: "cs",
    });

    expect(asArea).toBeNull();
  });

  it("maps every catalog level onto a document type", async () => {
    // A guard on FilterTypes: adding a level without extending the map would
    // silently produce catalog pages with no alternates.
    const levels = Object.values(FilterTypes);
    expect(levels).toEqual(["0", "1", "2", "3"]);
  });
});

describe("searchCountrySlugQuery", () => {
  it("returns the first country by studio order", async () => {
    expect(await run(searchCountrySlugQuery, { locale: "cs" })).toBe("cesko");
    expect(await run(searchCountrySlugQuery, { locale: "en" })).toBe(
      "czech-republic",
    );
  });
});
