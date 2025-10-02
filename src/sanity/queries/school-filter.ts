import { groq } from "next-sanity";
import { clientFetch } from "@/sanity/utilites/fetch";
import {
  CatalogParams,
  FilterTypes,
} from "@/app/catalog/[...slug]/utilites/catalog";
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
  tags: (SchoolTag & { count: number })[];
  types: (SchoolCategory & { count: number })[];
};

/** Tags (counts respect "all") */
export const tagsQuery = groq`
    "tags": *[_type == "schoolTags"]{
      "id": _id,
      name,
      "slug": slug.current,
      "backgroundColor": backgroundColor.hex,
      "count": count(*[
        _type == "schools" &&
        (!defined($country) || area->region->country->slug.current == $country) &&
        (!defined($region) || area->region->slug.current == $region) &&
        references(^._id)
      ]),
    }[count > 0] | order(name asc)
`;

/** Types / categories (counts respect "all") */
export const typesQuery = groq`
    "types": *[
    _type == "schoolCategories" &&
    (!defined(language) || language == $locale)
    ]{
      "id": _id,
      name,
      "slug": slug.current,
      "emoji": emoji.asset->url,
      "count": count(*[
        _type == "schools" &&
        (!defined($country) || area->region->country->slug.current == $country) &&
        (!defined($region) || area->region->slug.current == $region) &&
        references(^._id)
      ]),
    }[count > 0] | order(name asc),
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
      "count": count(*[
        _type == "schools" &&
        area->region->country._ref == ^._id
      ])
    }
  ] + *[_type == "regions" && country->slug.current == $country && (!defined(language) || language == $locale)]{
      "id": _id,
      name,
      "slug": "/" 
        + country->slug.current + "/" 
        + slug.current,
      "count": count(*[
        _type == "schools" &&
        area->region._ref == ^._id
      ])
    },
  "areas": [],
  "subareas": *[_type == "subareas" && area->region->country->slug.current == $country && (!defined(language) || language == $locale)]{
      "id": _id,
      name,
      "slug": "/" 
        + area->region->country->slug.current + "/" 
        + area->region->slug.current + "/" 
        + area->slug.current + "/" 
        + slug.current,
      "count": count(*[
        _type == "schools" &&
        subarea->region._ref == ^._id
      ])
    },
    ${typesQuery}
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
      "count": count(*[
        _type == "schools" &&
        area->region._ref == ^._id
      ])
    }
  ] + *[
      _type == "areas" &&
      region->slug.current == $region &&
      region->country->slug.current == $country &&
      (!defined(language) || language == $locale)
    ]{
      "id": _id,
      name,
      "slug": "/" 
        + region->country->slug.current + "/" 
        + region->slug.current + "/" 
        + slug.current,
      "count": count(*[
        _type == "schools" &&
        area._ref == ^._id
      ])
    },
  "subareas": *[_type == "subareas" && area->region->slug.current == $region && area->region->country->slug.current == $country && (!defined(language) || language == $locale)]{
      "id": _id,
      name,
      "slug": "/" 
        + area->region->country->slug.current + "/" 
        + area->region->slug.current + "/" 
        + area->slug.current + "/" 
        + slug.current,
      "count": count(*[
        _type == "schools" &&
        subarea._ref == ^._id
      ])
    },
    ${typesQuery}
    ${tagsQuery}
}
`;

// 3. Subarea level
// export const subareaQuery = groq`
// {
//   "country": *[_type == "countries" && slug.current == $country && (!defined(language) || language == $locale)][0]{
//       "id": _id,
//       name,
//       "slug": slug.current
//     },
//   "regions": *[_type == "regions" && slug.current == $region && country->slug.current == $country && (!defined(language) || language == $locale)]{
//       "id": _id,
//       name,
//       "slug": "/"
//         + country->slug.current + "/"
//         + slug.current,
//       "count": count(*[
//         _type == "schools" &&
//         area->region._ref == ^._id
//       ])
//     },
//   "areas": *[_type == "areas" && region->slug.current == $region && region->country->slug.current == $country && (!defined(language) || language == $locale)]{
//       "id": _id,
//       name,
//       "slug": "/"
//         + region->country->slug.current + "/"
//         + region->slug.current + "/"
//         + slug.current
//     },
//   "subareas": *[_type == "subareas" && area->region->slug.current == $region && area->region->country->slug.current == $country && (!defined(language) || language == $locale)]{
//       "id": _id,
//       name,
//       "slug": "/"
//         + area->region->country->slug.current + "/"
//         + area->region->slug.current + "/"
//         + area->slug.current + "/"
//         + slug.current
//     }
//   },
//   ${typesQuery}
//   ${tagsQuery}
// `;

export async function fetchFilters(
  catalog: CatalogParams,
): Promise<FiltersResponse> {
  switch (catalog.level) {
    case FilterTypes.country:
      return clientFetch(countryQuery, {
        country: catalog.country,
        region: null,
        area: null,
      });
    case FilterTypes.area:
    case FilterTypes.region:
    case FilterTypes.subarea:
      return clientFetch(regionQuery, {
        country: catalog.country,
        region: catalog.region,
        area: catalog.area,
        subarea: catalog.subarea,
      });
    // case FilterTypes.subarea:
    //   return clientFetch(subareaQuery, {
    //     country: catalog.country,
    //     region: catalog.region,
    //     area: catalog.area,
    //     subarea: catalog.subarea,
    //   });
    default:
      return {
        country: null,
        regions: [],
        areas: [],
        subareas: [],
        tags: [],
        types: [],
      };
  }
}
