import { defineQuery } from "next-sanity";
import {
  GroupPage,
  MarkerData,
  MiniSchool,
  PageHero,
  SchoolCategory,
  SchoolFilterQueryParams,
  SchoolPageQueryParams,
  SchoolTag,
} from "@/types";
import { CatalogParams } from "@/features/catalog/utils";
import { FilterTypes } from "@/types/school-filter";
import { excludeDraft, languageQuery } from "@/lib/sanity/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  areaPath,
  imageUrl,
  markerFields,
  pageHeroFields,
  regionPath,
  schoolCardFields,
  schoolCountForArea,
  schoolCountForCountry,
  schoolCountForRegion,
  schoolCountForSubarea,
  subareaPath,
  tagFields,
} from "@/lib/sanity/fragments";
import { removeDiacritics } from "@/utils/strings";
import { orderByDailyShuffle } from "@/lib/sanity/dailyOrder";
import { getDailySeed } from "@/lib/sanity/dailySeed";

/**
 * Everything the catalog reads: the list and its markers, the filter sidebar's
 * counts, and the groups index that sits above it.
 *
 * One module per feature rather than one per query. They share `baseFilter`
 * and the geography count fragments, and splitting them across three files is
 * what made the old `sanity/queries` folder hard to hold in one's head.
 */

// ============================ the list ============================

/**
 * The headline "N schools" figure for the current scope.
 *
 * Was `…[0].schoolCount`, a number a nightly script wrote onto the country and
 * region documents. Counting the schools directly cannot go stale, and it is
 * one aggregate at the database rather than a field the studio had to
 * maintain.
 */
const countryTotalQuery = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region->country->slug.current == $country
])`;

const regionTotalQuery = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region->slug.current == $region &&
  area->region->country->slug.current == $country
])`;

const schoolPageProjection = `
    "pageHero": *[_type == "schoolPage" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },`;

/**
 * The page header, with the total counted for the scope the URL names.
 *
 * These are two named queries rather than one built from a `totalQuery`
 * argument. Both spellings produce the same GROQ; only this one is a value
 * TypeGen can see, and a query assembled inside a function call is a query it
 * silently omits from the generated types. The two projections are otherwise
 * identical, so `SchoolPageCountryQueryResult` and its region twin are the
 * same shape.
 */
export const schoolPageCountryQuery = defineQuery(`{
    ${schoolPageProjection}
    "totalSchools": coalesce(${countryTotalQuery}, 0),
  }`);

export const schoolPageRegionQuery = defineQuery(`{
    ${schoolPageProjection}
    "totalSchools": coalesce(${regionTotalQuery}, 0),
  }`);

export async function fetchSchoolPage(params: SchoolPageQueryParams) {
  const query =
    params.country && params.region
      ? schoolPageRegionQuery
      : schoolPageCountryQuery;

  return sanityFetch<{ pageHero: PageHero; totalSchools: number }>(
    query,
    {
      country: params.country ?? null,
      region: params.region ?? null,
      locale: params.locale,
    },
    ["schools", "geo", "page:schoolPage"],
  );
}

const baseFilter = `
    _type == "schools" &&
    ${languageQuery} &&
    ${excludeDraft} &&
    (!defined($country) || countrySlug == $country) &&
    (!defined($region) || regionSlug == $region) &&
    (!defined($area) || area->slug.current == $area) &&
    (!defined($subarea) || subarea->slug.current == $subarea)`;

// One template literal rather than `baseFilter + "..."`: TypeGen evaluates
// these statically and rejects a concatenation ("Unsupported expression type:
// BinaryExpression"), which drops every query built from it.
const extendedFilter = `${baseFilter}
    && (!defined($categories) || count($categories) == 0 || count(categories[@->slug.current in $categories]) > 0) &&
    (!defined($tags) || count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0) &&
    (!defined($search) || lower(nameNormalized) match "*" + lower($search) + "*")
  `;

/**
 * Map markers for the current geographic scope.
 *
 * Deliberately filtered by `baseFilter` only - country/region/area/subarea -
 * and NOT by categories, tags or the search term. That is what the combined
 * query did before this was split, so the map has always shown every school in
 * the area regardless of which list filters are active, and that behaviour is
 * preserved here.
 *
 * Splitting it out of the list query is what makes that worth doing: the
 * marker set no longer changes when a filter does, so one cache entry per geo
 * scope serves every combination of filters.
 */
export const schoolMarkersQuery = defineQuery(`*[${baseFilter}]{
    ${markerFields}
  }`);

export type SchoolMarkersParams = {
  country: string;
  region?: string;
  area?: string;
  subarea?: string;
  locale: string;
};

export async function fetchSchoolMarkers(params: SchoolMarkersParams) {
  return sanityFetch<MarkerData[]>(
    schoolMarkersQuery,
    {
      country: params.country ?? null,
      region: params.region ?? null,
      area: params.area ?? null,
      subarea: params.subarea ?? null,
      locale: params.locale,
    },
    ["schools"],
  );
}

/**
 * Every school the filters select, reduced to what the ordering needs.
 *
 * Ordering used to be `order(isHighPriority desc, sortOrder asc)` with
 * `sortOrder` a random number stored on each document. The shuffle is now
 * computed in JS (see lib/sanity/dailyOrder.ts), which GROQ cannot do -
 * so the ids come back first, get ordered, and only the requested page is
 * hydrated into cards.
 *
 * This is two round-trips instead of one, but neither is the expensive part:
 * this query returns an id and a boolean per school and is shared by every
 * page of the same filter set, and the card query below only ever touches one
 * page worth of documents.
 */
export const schoolOrderQuery = defineQuery(`*[${extendedFilter}]{
    "id": _id,
    isHighPriority
  }`);

/** The card fields for one page of schools, fetched by id. */
export const schoolCardsQuery =
  defineQuery(`*[_type == "schools" && _id in $ids]{
    ${schoolCardFields}
  }`);

function filterParams(params: SchoolFilterQueryParams) {
  return {
    country: params.country ?? null,
    region: params.region ?? null,
    area: params.area ?? null,
    subarea: params.subarea ?? null,
    categories: params.categories ?? [],
    tags: params.tags ?? [],
    search: removeDiacritics(params.search) ?? null,
    locale: params.locale,
  };
}

/**
 * One page of the filtered list, plus the total the filters select.
 *
 * The shuffle is applied here rather than inside `sanityFetch`, which would
 * freeze one order into the query's cache entry. The seed comes from
 * `getDailySeed`, which is cached with `cacheLife("days")` - so the order is
 * identical for every request in a day, including the load-more Server Action
 * paging through this same list hours later.
 */
export async function fetchSchoolList(params: SchoolFilterQueryParams) {
  const [selected, seed] = await Promise.all([
    sanityFetch<{ id: string; isHighPriority?: boolean }[]>(
      schoolOrderQuery,
      filterParams(params),
      ["schools"],
    ),
    getDailySeed(),
  ]);

  const ordered = orderByDailyShuffle(selected, seed);

  const start = params.start ?? 0;
  const end = params.end ?? 10000;
  const ids = ordered.slice(start, end).map((school) => school.id);

  if (ids.length === 0) {
    return { totalSelectedSchools: ordered.length, schools: [] };
  }

  const cards = await sanityFetch<MiniSchool[]>(schoolCardsQuery, { ids }, [
    "schools",
  ]);

  // `_id in $ids` returns documents in the dataset's own order, so the page is
  // put back into the order that produced the ids.
  const byId = new Map(cards.map((school) => [school.id, school]));

  return {
    totalSelectedSchools: ordered.length,
    schools: ids
      .map((id) => byId.get(id))
      .filter((school): school is MiniSchool => Boolean(school)),
  };
}

// ========================= the filter sidebar =====================

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

export type FiltersResponse = {
  country: CategoryItem | null;
  regions: CategoryItem[];
  areas: CategoryItem[];
  subareas: CategoryItem[];
  tags: SchoolTag[];
  categories: SchoolCategory[];
};

/** Tags (counts respect "all") */
export const tagsQuery = `
    "tags": *[_type == "schoolTags"]{
      ${tagFields},
    } | order(name asc)
`;

/** Types / categories (counts respect "all") */
export const categoriesQuery = `
    "categories": *[
    _type == "schoolCategories" &&
    (!defined(language) || language == $locale)
    ]{
      "id": _id,
      name,
      "slug": slug.current,
      ${imageUrl("emoji")},
    } | order(name asc),
`;

// 1. Country level
export const countryQuery = defineQuery(`
{
  "country": *[_type == "countries" && slug.current == $country && (!defined(language) || language == $locale)][0]{
      "id": _id,
      name,
      "slug": slug.current
    },
  "regions": [
    *[
      _type == "countries" &&
      slug.current == $country &&
      (!defined(language) || language == $locale)
    ][0]{
      "id": _id,
      "name": name,
      "slug": slug.current,
      "count": ${schoolCountForCountry},
    }
  ] + *[_type == "regions" && country->slug.current == $country && (!defined(language) || language == $locale)] | order(orderRank) {
      "id": _id,
      name,
      "slug": "/"
        + country->slug.current + "/"
        + slug.current,
      "count": ${schoolCountForRegion},
    },
  "areas": [],
  "subareas": *[
      _type == "subareas" &&
      area->region->country->slug.current == $country &&
      (!defined(language) || language == $locale)
    ] | order(orderRank) {
      "id": _id,
      name,
      "slug": ${subareaPath},
      "count": ${schoolCountForSubarea},
    },
    ${categoriesQuery}
    ${tagsQuery}
}
`);

// 2. Region level
export const regionQuery = defineQuery(`
{
  "country": *[_type == "countries" && slug.current == $country && (!defined(language) || language == $locale)][0]{
      "id": _id,
      name,
      "slug": slug.current
    },
  "regions": [],
  "areas": [
    *[
      _type == "regions" &&
      slug.current == $region &&
      country->slug.current == $country &&
      (!defined(language) || language == $locale)
    ][0]{
      "id": _id,
      "name": name,
      "slug": "/" + country->slug.current + "/" + slug.current,
      "count": ${schoolCountForRegion},
    }
  ] + *[
      _type == "areas" &&
      region->slug.current == $region &&
      region->country->slug.current == $country &&
      (!defined(language) || language == $locale)
    ] | order(orderRank) {
      "id": _id,
      name,
      "slug": ${areaPath},
      "count": ${schoolCountForArea},
    },
  "subareas": *[
      _type == "subareas" &&
      area->region->slug.current == $region &&
      area->region->country->slug.current == $country &&
      (!defined(language) || language == $locale)
    ] | order(orderRank) {
      "id": _id,
      name,
      "slug": ${subareaPath},
      "count": ${schoolCountForSubarea},
    },
    ${categoriesQuery}
    ${tagsQuery}
}
`);

export async function fetchFilters(
  catalog: CatalogParams,
  locale: string,
): Promise<FiltersResponse> {
  switch (catalog.level) {
    case FilterTypes.country: {
      return sanityFetch<FiltersResponse>(
        countryQuery,
        { country: catalog.country, region: null, area: null, locale },
        ["schools", "geo"],
      );
    }
    case FilterTypes.area:
    case FilterTypes.region:
    case FilterTypes.subarea:
      return sanityFetch<FiltersResponse>(
        regionQuery,
        {
          country: catalog.country,
          region: catalog.region,
          area: catalog.area,
          subarea: catalog.subarea,
          locale,
        },
        ["schools", "geo"],
      );
    default:
      return {
        country: null,
        regions: [],
        areas: [],
        subareas: [],
        tags: [],
        categories: [],
      };
  }
}

// ========================== the groups index ======================

/**
 * Per-category school counts, resolved by GROQ rather than in JavaScript.
 *
 * This used to pull every school document in the dataset - `regionRef` and
 * `categoryRefs` for all of them - and tally the pairs in a JS loop. The
 * counts are the only thing that survived that transfer, so `count()` does the
 * same work at the database and returns integers.
 *
 * `^` walks out one scope per level: inside the count filter it is the
 * category being projected, `^.^` the region around it.
 */
const categoryCountsForRegion = `
  "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
    "id": _id,
    name,
    "slug": slug.current,
    ${imageUrl("emoji")},
    "schoolCount": count(*[
      _type == "schools" &&
      ${languageQuery} &&
      area->region._ref == ^.^._id &&
      ^._id in categories[]._ref
    ])
  }
`;

/**
 * The same counts for the country row, which is the sum over every region.
 *
 * `defined(area->region._ref)` keeps it equal to the old JS total: that loop
 * skipped schools with no region, so they were never part of any sum.
 */
const categoryCountsForCountry = `
  "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
    "id": _id,
    name,
    "slug": slug.current,
    ${imageUrl("emoji")},
    "schoolCount": count(*[
      _type == "schools" &&
      ${languageQuery} &&
      defined(area->region._ref) &&
      ^._id in categories[]._ref
    ])
  }
`;

export const groupPageQuery = defineQuery(`{
    "content": *[_type == "group" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },

    "regions": *[_type == "regions" && ${languageQuery}]{
      "id": _id,
      "totalSchools": ${schoolCountForRegion},
      name,
      "slug": ${regionPath},
      ${imageUrl("backgroundCover")},
      "regionRef": _id,
      "areas": *[_type == "areas" && ${languageQuery} && region._ref == ^._id]{
        "id": _id,
        name,
        "slug": ${areaPath},
        "schoolCount": ${schoolCountForArea},
        "regionRef": region._ref
      },
      ${categoryCountsForRegion}
    },

    "country": *[_type == "countries" && ${languageQuery}][0]{
      "id": _id,
      name,
      "slug": slug.current,
      ${imageUrl("backgroundCover")},
      "totalSchools": ${schoolCountForCountry},
      "areas": *[_type == "regions" && ${languageQuery}]{
        "id": _id,
        name,
        "slug": ${regionPath},
        "schoolCount": ${schoolCountForRegion}
      },
      ${categoryCountsForCountry}
    }
  }`);

export async function fetchGroupPage(locale: string) {
  const data = await sanityFetch<{
    content?: PageHero;
    regions?: GroupPage[];
    country?: GroupPage;
  }>(groupPageQuery, { locale }, ["schools", "geo", "page:group"]);

  if (!data.regions) return { content: data.content };

  // The country row is rendered as one more group, after the regions.
  const groups: GroupPage[] = data.country
    ? [...data.regions, data.country]
    : data.regions;

  return { groups, content: data.content };
}
