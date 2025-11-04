import { groq } from "next-sanity";
import { clientFetch } from "@/sanity/utilites/fetch";
import {
  CatalogParams,
  FilterTypes,
} from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { SchoolCategory, SchoolTag } from "@/sanity/types";

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
export const tagsQuery = groq`
    "tags": *[_type == "schoolTags"]{
      "id": _id,
      name,
      "slug": slug.current,
      "borderColor": borderColor.hex,
    } | order(name asc)
`;

/** Types / categories (counts respect "all") */
export const categoriesQuery = groq`
    "categories": *[
    _type == "schoolCategories" &&
    (!defined(language) || language == $locale)
    ]{
      "id": _id,
      name,
      "slug": slug.current,
      "emoji": emoji.asset->url,
    } | order(name asc),
`;

// 1. Country level
export const countryQuery = groq`
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
      "count": schoolCount,
    }
  ] + *[_type == "regions" && country->slug.current == $country && (!defined(language) || language == $locale)] | order(orderRank) {
      "id": _id,
      name,
      "slug": "/" 
        + country->slug.current + "/" 
        + slug.current,
      "count": schoolCount,
    },
  "areas": [],
  "subareas": *[_type == "subareas" && countrySlug == $country && (!defined(language) || language == $locale)] | order(orderRank, schoolCount desc) {
      "id": _id,
      name,
      "slug": fullSlug,
      "count": schoolCount,

    },
    ${categoriesQuery}
    ${tagsQuery}
}
`;

// 2. Region level
export const regionQuery = groq`
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
      "count": schoolCount,
    }
  ] + *[
      _type == "areas" &&
      regionSlug == $region &&
      countrySlug == $country &&
      (!defined(language) || language == $locale)
    ] | order(orderRank) {
      "id": _id,
      name,
      "slug": fullSlug,
      "count": schoolCount,
    },
  "subareas": *[_type == "subareas" && regionSlug == $region && countrySlug == $country && (!defined(language) || language == $locale)] | order(orderRank, schoolCount desc) {
      "id": _id,
      name,
      "slug": fullSlug,
      "count": schoolCount,
    },
    ${categoriesQuery}
    ${tagsQuery}
}
`;

export async function fetchFilters(
  catalog: CatalogParams,
): Promise<FiltersResponse> {
  switch (catalog.level) {
    case FilterTypes.country: {
      return clientFetch(countryQuery, {
        country: catalog.country,
        region: null,
        area: null,
      }) as Promise<FiltersResponse>;
    }
    case FilterTypes.area:
    case FilterTypes.region:
    case FilterTypes.subarea:
      return clientFetch(regionQuery, {
        country: catalog.country,
        region: catalog.region,
        area: catalog.area,
        subarea: catalog.subarea,
      }) as Promise<FiltersResponse>;
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
