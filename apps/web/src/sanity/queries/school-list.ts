import { groq } from "next-sanity";
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

const countryTotalQuery = groq`*[_type == "countries" && ${excludeDraft} && ${languageQuery} && slug.current == $country][0].schoolCount`;
const regionTotalQuery = groq`*[_type == "regions" && ${excludeDraft} && ${languageQuery} && slug.current == $region][0].schoolCount`;

export const schoolPageQuery = (totalQuery: string) => groq`{
    "pageHero": *[_type == "schoolPage" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },
    "totalSchools": coalesce(${totalQuery}, 0),
  }`;

export async function fetchSchoolPage(params: SchoolPageQueryParams) {
  const totalQuery =
    params.country && params.region ? regionTotalQuery : countryTotalQuery;

  return sanityFetch<{ pageHero: PageHero; totalSchools: number }>(
    schoolPageQuery(totalQuery),
    {
      country: params.country ?? null,
      region: params.region ?? null,
      locale: params.locale,
    },
    ["schools", "geo", "page:schoolPage"],
  );
}

const baseFilter = groq`
    _type == "schools" &&
    ${languageQuery} &&
    ${excludeDraft} &&
    (!defined($country) || countrySlug == $country) &&
    (!defined($region) || regionSlug == $region) &&
    (!defined($area) || area->slug.current == $area) &&
    (!defined($subarea) || subarea->slug.current == $subarea)`;

const extendedFilter =
  baseFilter +
  groq`&& (!defined($categories) || count($categories) == 0 || count(categories[@->slug.current in $categories]) > 0) &&
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
export const schoolMarkersQuery = groq`*[${baseFilter}]{
    ${markerFields}
  }`;

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

/** One page of the filtered list, plus the total the filters select. */
export const schoolListQuery = groq`{
    "totalSelectedSchools": count(*[${extendedFilter}]),
    "schools": *[${extendedFilter}] | order(isHighPriority desc, sortOrder asc) [$start...$end]  {
      ${schoolCardFields}
    },
  }`;

export async function fetchSchoolList(params: SchoolFilterQueryParams) {
  return sanityFetch<{
    totalSelectedSchools: number;
    schools: MiniSchool[];
  }>(
    schoolListQuery,
    {
      country: params.country ?? null,
      region: params.region ?? null,
      area: params.area ?? null,
      subarea: params.subarea ?? null,
      categories: params.categories ?? [],
      tags: params.tags ?? [],
      search: removeDiacritics(params.search) ?? null,
      start: params.start ?? 0,
      end: params.end ?? 10000,
      locale: params.locale,
    },
    ["schools"],
  );
}
