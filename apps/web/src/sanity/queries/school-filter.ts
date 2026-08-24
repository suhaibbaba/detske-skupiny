import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  areaPath,
  imageUrl,
  schoolCountForArea,
  schoolCountForCountry,
  schoolCountForRegion,
  schoolCountForSubarea,
  subareaPath,
  tagFields,
} from "@/lib/sanity/fragments";
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
