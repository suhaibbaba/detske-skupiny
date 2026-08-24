import { defineQuery } from "next-sanity";
import {
  MarkerData,
  MiniSchool,
  PageHero,
  SchoolFilterQueryParams,
  SchoolPageQueryParams,
} from "@/sanity/types";
import { excludeDraft, languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  markerFields,
  pageHeroFields,
  schoolCardFields,
} from "@/lib/sanity/fragments";
import { removeDiacritics } from "@/utilites/strings";
import { orderByDailyShuffle } from "@/sanity/utilites/dailyOrder";
import { getDailySeed } from "@/lib/sanity/dailySeed";

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
 * computed in JS (see sanity/utilites/dailyOrder.ts), which GROQ cannot do -
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
