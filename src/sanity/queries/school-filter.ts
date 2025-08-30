// /sanity/queries/filters.ts
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { SchoolFilterModel, SchoolFilterQueryParams } from "@/sanity/types";

export const regionBaseQuery = groq`
  *[
    _type == "regions" &&
    slug.current == $regionSlug &&
    (!defined(language) || language == $locale)
  ][0]{
    "id": _id,
    name,
    "slug": slug.current
  }
`;

// total schools in region
export const totalSchoolsQuery = groq`
  count(*[
    _type == "schools" &&
    area->region->slug.current == $regionSlug
  ])
`;

export const totalSchoolsFilteredQuery = groq`
  count(*[
    _type == "schools" &&
    area->region->slug.current == $regionSlug &&
    (!defined($areas) || area->slug.current in $areas) &&
    (!defined($types) || references(*[_type=="schoolCategories" && slug.current in $types]._id)) &&
    (!defined($tags)  || references(*[_type=="tag"              && slug.current in $tags]._id))
  ])`;

// main areas
export const mainAreasQuery = groq`
  *[
    _type == "areas" &&
    region->slug.current == $regionSlug &&
    coalesce(isMain, false) == true
  ]{
    "id": _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "schools" &&
      area._ref == ^._id
    ])
  } | order(name asc)
`;

// other areas
export const otherAreasQuery = groq`
  *[
    _type == "areas" &&
    region->slug.current == $regionSlug &&
    coalesce(isMain, false) == false
  ]{
    "id": _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "schools" &&
      area._ref == ^._id
    ])
  } | order(name asc)
`;

// tags
export const tagsQuery = groq`
  *[_type == "schoolTags"]{
    "id": _id,
    name,
    "slug": slug.current,
    "borderColor": borderColor.hex,
    "count": count(*[
      _type == "schools" &&
      area->region->slug.current == $regionSlug &&
      references(^._id)
    ]),
    "emoji": emoji.asset->url,
  }[count > 0] | order(name asc)
`;

// types (school categories)
export const typesQuery = groq`
  *[
    _type == "schoolCategories" &&
    (!defined(language) || language == $locale)
  ]{
    "id": _id,
    name,
    "slug": slug.current,
    "emoji": emoji.asset->url,
    "count": count(*[
      _type == "schools" &&
      area->region->slug.current == $regionSlug &&
      references(^._id)
    ]),
  }[count > 0] | order(name asc)
`;

export async function fetchSchoolFilterQuery(params: SchoolFilterQueryParams) {
  const query = groq`
    {
      "region": ${regionBaseQuery},
      "totalSchools": ${totalSchoolsQuery},
      "totalSchoolsFiltered": ${totalSchoolsFilteredQuery},
      "mainAreas": ${mainAreasQuery},
      "otherAreas": ${otherAreasQuery},
      "tags": ${tagsQuery},
      "types": ${typesQuery}
    }
  `;

  const safeParams = {
    ...params,
    areas: params.areas ?? [], // default empty array
    types: params.types ?? [],
    tags: params.tags ?? [],
  };
  return client.fetch<SchoolFilterModel>(query, safeParams);
}
