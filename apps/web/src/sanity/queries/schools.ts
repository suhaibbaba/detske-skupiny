import { groq } from "next-sanity";
import { MiniSchool, PageHero, School } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  areaPath,
  imageUrl,
  internalLinkFields,
  linkFields,
  pageHeroFields,
  regionPath,
  schoolCardFields,
  schoolCategoryFields,
  tagFields,
} from "@/lib/sanity/fragments";
import { orderByDailyShuffle } from "@/sanity/utilites/dailyOrder";

/**
 * The candidates for the home and cooperation carousels.
 *
 * Every high-priority school, not a page of them: the carousel shows a handful
 * and which handful is decided by the daily shuffle below, which needs the
 * whole set to choose from. The projection is an id and a flag, so the size of
 * that set costs almost nothing.
 */
export const highPrioritySchoolsQuery = groq`*[
    _type == "schools" &&
    ${languageQuery} &&
    (true in types[]->highPriority)
  ]{
    "id": _id,
    isHighPriority
  }`;

/** The card fields for the schools the shuffle picked. */
export const schoolCardsByIdQuery = groq`*[_type == "schools" && _id in $ids]{
    ${schoolCardFields}
  }`;

/**
 * A stable daily selection of high-priority schools.
 *
 * Replaces `order(sortOrder asc)[0...$numberOfSchools]`, which read a random
 * number a nightly script wrote onto every school document. The shuffle runs
 * outside `sanityFetch` so it is not frozen into a cache entry - see
 * sanity/utilites/dailyOrder.ts.
 *
 * The carousels sit on pages that are otherwise fully cached, so in practice
 * the visible selection changes when the page is regenerated (a publish, or a
 * new deploy) rather than at midnight sharp. That is the same trade the rest
 * of the site makes by caching with `cacheLife("max")`; if the rotation ever
 * needs to be exactly daily, this is the one query to give `cacheLife("days")`.
 */
export async function fetchMiniSchools(params: {
  numberOfSchools: number;
  locale: string;
}) {
  const candidates = await sanityFetch<
    { id: string; isHighPriority?: boolean }[]
  >(highPrioritySchoolsQuery, { locale: params.locale }, ["schools"]);

  const ids = orderByDailyShuffle(candidates)
    .slice(0, params.numberOfSchools)
    .map((school) => school.id);

  if (ids.length === 0) {
    return { schools: [] };
  }

  const cards = await sanityFetch<MiniSchool[]>(
    schoolCardsByIdQuery,
    { ids },
    ["schools"],
  );

  const byId = new Map(cards.map((school) => [school.id, school]));

  return {
    schools: ids
      .map((id) => byId.get(id))
      .filter((school): school is MiniSchool => Boolean(school)),
  };
}

export const schoolBySlugQuery = groq`{
    "pageHero": *[_type == "schoolPage" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },
    "school": *[_type == "schools" && ${languageQuery} &&  slug.current == $slug][0]{
      "id": _id,
      ${imageUrl("logo")},
      name,
      metaDescription,
      "slug": slug.current,
      website{ ${linkFields} },
      "primaryImages": primaryImages[].asset->url,
      "primaryImage": select(defined(primaryImages[0].asset) => primaryImages[0].asset->url, null),
      "region": area->region->{
        "id": _id,
        name,
        "countrySlug": country->slug.current,
        "fullSlug": ${regionPath},
      },
      capacity,
      providerName,
      area->{ "id": _id, name, "fullSlug": ${areaPath} },
      address,
      location,
      cin,
      contacts[],
      links[]{
        "id": _key,
        ...link,
        "internalLink": link.internalLink->{ ${internalLinkFields} },
      },
      types[]->{
        "id": _id,
        name,
        "slug": slug.current
      },
      categories[]->{ ${schoolCategoryFields} },
      transportation[]{
        "id": _key,
        ...
      },
      content,
      tags[]->{ ${tagFields} },
    }
  }`;

export async function fetchSchoolBySlug(params: {
  slug: string;
  locale: string;
}) {
  return sanityFetch<{ pageHero: PageHero; school: School }>(
    schoolBySlugQuery,
    { ...params },
    ["schools", "page:schoolPage"],
  );
}
