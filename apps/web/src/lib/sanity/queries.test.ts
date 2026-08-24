import { describe, expect, it } from "vitest";
import { evaluate, parse } from "groq-js";

import {
  breadcrumbListQuery,
  schoolBreadcrumbQuery,
} from "@/lib/sanity/breadcrumb";
import { pageByTypeQuery } from "@/lib/sanity/page";
import {
  countryQuery,
  groupPageQuery,
  regionQuery,
  schoolCardsQuery,
  schoolMarkersQuery,
  schoolOrderQuery,
  schoolPageCountryQuery,
  schoolPageRegionQuery,
} from "@/features/catalog/queries";
import {
  highPrioritySchoolsQuery,
  schoolBySlugQuery,
  schoolCardsByIdQuery,
} from "@/features/school/queries";

/**
 * Runs the real GROQ against a synthetic dataset.
 *
 * The queries are assembled from shared fragments in lib/sanity/fragments.ts,
 * and a fragment that expands to something ungrammatical produces a query that
 * only fails when Sanity is asked to run it - which no unit test and no build
 * would notice. Parsing every exported query here closes that gap.
 *
 * The evaluated cases go further and pin the values the migration had to
 * preserve: the school counts that replaced the stored `schoolCount` field,
 * and the composed catalog paths that replaced `fullSlug`.
 */

const dataset = [
  {
    _id: "country-cz",
    _type: "countries",
    name: "Cesko",
    slug: { current: "cesko" },
    language: "cs",
    orderRank: "a",
  },

  {
    _id: "region-praha",
    _type: "regions",
    name: "Praha",
    slug: { current: "praha" },
    country: { _ref: "country-cz" },
    language: "cs",
    orderRank: "a",
  },
  {
    _id: "region-brno",
    _type: "regions",
    name: "Brno",
    slug: { current: "brno" },
    country: { _ref: "country-cz" },
    language: "cs",
    orderRank: "b",
  },

  {
    _id: "area-praha-1",
    _type: "areas",
    name: "Praha 1",
    slug: { current: "praha-1" },
    region: { _ref: "region-praha" },
    language: "cs",
    orderRank: "a",
  },
  {
    _id: "area-brno-stred",
    _type: "areas",
    name: "Brno Stred",
    slug: { current: "brno-stred" },
    region: { _ref: "region-brno" },
    language: "cs",
    orderRank: "a",
  },

  {
    _id: "subarea-mala-strana",
    _type: "subareas",
    name: "Mala Strana",
    slug: { current: "mala-strana" },
    area: { _ref: "area-praha-1" },
    language: "cs",
    orderRank: "a",
  },

  { _id: "type-hp", _type: "schoolTypes", name: "Top", highPriority: true },
  {
    _id: "cat-a",
    _type: "schoolCategories",
    name: "Cat A",
    slug: { current: "cat-a" },
    language: "cs",
  },

  {
    _id: "school-1",
    _type: "schools",
    name: "Skolka Jedna",
    nameNormalized: "skolka jedna",
    slug: { current: "skolka-jedna" },
    countrySlug: "cesko",
    regionSlug: "praha",
    isHighPriority: true,
    area: { _ref: "area-praha-1" },
    subarea: { _ref: "subarea-mala-strana" },
    types: [{ _ref: "type-hp" }],
    categories: [{ _ref: "cat-a" }],
    language: "cs",
  },
  {
    _id: "school-2",
    _type: "schools",
    name: "Skolka Dva",
    nameNormalized: "skolka dva",
    slug: { current: "skolka-dva" },
    countrySlug: "cesko",
    regionSlug: "praha",
    area: { _ref: "area-praha-1" },
    language: "cs",
  },
  {
    _id: "school-3",
    _type: "schools",
    name: "Skolka Tri",
    nameNormalized: "skolka tri",
    slug: { current: "skolka-tri" },
    countrySlug: "cesko",
    regionSlug: "brno",
    area: { _ref: "area-brno-stred" },
    language: "cs",
  },

  { _id: "schoolPage", _type: "schoolPage", language: "cs", pageHero: {} },
  { _id: "group", _type: "group", language: "cs", pageHero: {} },
];

const baseParams = {
  locale: "cs",
  country: "cesko",
  region: null,
  area: null,
  subarea: null,
  categories: [],
  tags: [],
  search: null,
  ids: ["school-1", "school-3"],
  slug: "skolka-jedna",
  slugs: ["praha"],
  type: "home",
};

async function run(query: string, params: Record<string, unknown> = {}) {
  const tree = parse(query);
  const result = await evaluate(tree, {
    dataset,
    params: { ...baseParams, ...params },
  });
  return result.get();
}

/** Every GROQ string the app can send, by the name it is exported under. */
const ALL_QUERIES: Record<string, string> = {
  breadcrumbListQuery,
  schoolBreadcrumbQuery,
  groupPageQuery,
  pageByTypeQuery,
  countryQuery,
  regionQuery,
  schoolCardsQuery,
  schoolMarkersQuery,
  schoolOrderQuery,
  schoolPageCountryQuery,
  schoolPageRegionQuery,
  highPrioritySchoolsQuery,
  schoolBySlugQuery,
  schoolCardsByIdQuery,
};

describe("every exported query is valid GROQ", () => {
  it.each(Object.keys(ALL_QUERIES))("%s parses", (name) => {
    expect(() => parse(ALL_QUERIES[name])).not.toThrow();
  });

  it("has no unexpanded template placeholder left in any query", () => {
    // A fragment written as `${"${foo}"}` interpolates to the literal text
    // rather than the fragment, which parses as GROQ in some positions and
    // silently queries nothing.
    for (const [name, query] of Object.entries(ALL_QUERIES)) {
      expect(query, `${name} contains an unexpanded \${...}`).not.toMatch(
        /\$\{/,
      );
    }
  });
});

describe("school counts replacing the stored schoolCount field", () => {
  it("counts every school in the country", async () => {
    const result = (await run(countryQuery)) as {
      regions: { slug: string; count: number }[];
    };

    // The country row, then one row per region.
    expect(result.regions[0]).toMatchObject({ slug: "cesko", count: 3 });
    expect(result.regions.slice(1)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: "/cesko/praha", count: 2 }),
        expect.objectContaining({ slug: "/cesko/brno", count: 1 }),
      ]),
    );
  });

  it("counts schools per area and subarea at region level", async () => {
    const result = (await run(regionQuery, { region: "praha" })) as {
      areas: { slug: string; count: number }[];
      subareas: { slug: string; count: number }[];
    };

    expect(result.areas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: "/cesko/praha", count: 2 }),
        expect.objectContaining({ slug: "/cesko/praha/praha-1", count: 2 }),
      ]),
    );
    expect(result.subareas).toEqual([
      expect.objectContaining({
        slug: "/cesko/praha/praha-1/mala-strana",
        count: 1,
      }),
    ]);
  });

  it("counts schools for the groups page at every level", async () => {
    const result = (await run(groupPageQuery)) as {
      regions: {
        slug: string;
        totalSchools: number;
        areas: { slug: string; schoolCount: number }[];
      }[];
      country: { totalSchools: number };
    };

    expect(result.country.totalSchools).toBe(3);

    const praha = result.regions.find((r) => r.slug === "/cesko/praha")!;
    expect(praha.totalSchools).toBe(2);
    expect(praha.areas).toEqual([
      expect.objectContaining({ slug: "/cesko/praha/praha-1", schoolCount: 2 }),
    ]);
  });
});

describe("catalog paths replacing the stored fullSlug field", () => {
  it("composes the school detail page's region and area paths", async () => {
    const result = (await run(schoolBySlugQuery)) as {
      school: {
        region: { countrySlug: string; fullSlug: string };
        area: { fullSlug: string };
      };
    };

    expect(result.school.region).toMatchObject({
      countrySlug: "cesko",
      fullSlug: "/cesko/praha",
    });
    expect(result.school.area.fullSlug).toBe("/cesko/praha/praha-1");
  });

  it("composes the school breadcrumb down to the area", async () => {
    const result = (await run(schoolBreadcrumbQuery)) as {
      breadcrumb: { name: string; slug: string }[];
    };

    expect(result.breadcrumb.map((crumb) => crumb.slug)).toEqual([
      "cesko",
      "/cesko/praha",
      "/cesko/praha/praha-1",
      "skolka-jedna",
    ]);
  });
});

describe("the ordering query that replaced sortOrder", () => {
  it("returns the id and priority of every selected school", async () => {
    const result = (await run(schoolOrderQuery)) as {
      id: string;
      isHighPriority: boolean | null;
    }[];

    expect(result).toHaveLength(3);
    expect(result.map((school) => school.id).sort()).toEqual([
      "school-1",
      "school-2",
      "school-3",
    ]);
    expect(result.find((s) => s.id === "school-1")?.isHighPriority).toBe(true);
  });

  it("hydrates exactly the ids it is given", async () => {
    const result = (await run(schoolCardsQuery)) as { id: string }[];

    expect(result.map((school) => school.id).sort()).toEqual([
      "school-1",
      "school-3",
    ]);
  });
});
