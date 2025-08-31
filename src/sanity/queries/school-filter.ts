import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { SchoolFilterModel, SchoolFilterQueryParams } from "@/sanity/types";

/** Region info (supports "all") */
export const regionBaseQuery = groq`
  select(
    $regionSlug == "all" => {
      "id": "all",
      "name": "All Regions",
      "slug": "all"
    },
    *[
      _type == "regions" &&
      slug.current == $regionSlug &&
      (!defined(language) || language == $locale)
    ][0]{
      "id": _id,
      name,
      "slug": slug.current
    }
  )
`;

/** Total schools (supports "all") */
export const totalSchoolsQuery = groq`
  count(*[
    _type == "schools" &&
    (
      $regionSlug == "all" ||
      area->region->slug.current == $regionSlug
    )
  ])
`;

/** Total schools after filters (supports "all") */
export const totalSchoolsFilteredQuery = groq`
  count(*[
    _type == "schools" &&
    (
      $regionSlug == "all" ||
      area->region->slug.current == $regionSlug
    ) &&
    (!defined($areas) || count($areas) == 0 || area->slug.current in $areas) &&
    (!defined($types) || count($types) == 0 || references(*[_type=="schoolCategories" && slug.current in $types]._id)) &&
    (!defined($tags)  || count($tags)  == 0 || references(*[_type=="schoolTags"      && slug.current in $tags]._id))
  ])
`;

/** Main areas (supports "all") */
export const mainAreasQuery = groq`
  *[
    _type == "areas" &&
    (
      $regionSlug == "all" ||
      region->slug.current == $regionSlug
    ) &&
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

/** Other areas (supports "all") */
export const otherAreasQuery = groq`
  *[
    _type == "areas" &&
    (
      $regionSlug == "all" ||
      region->slug.current == $regionSlug
    ) &&
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

/** Tags (counts respect "all") */
export const tagsQuery = groq`
  *[_type == "schoolTags"]{
    "id": _id,
    name,
    "slug": slug.current,
    "borderColor": borderColor.hex,
    "count": count(*[
      _type == "schools" &&
      (
        $regionSlug == "all" ||
        area->region->slug.current == $regionSlug
      ) &&
      references(^._id)
    ]),
    "emoji": emoji.asset->url,
  }[count > 0] | order(name asc)
`;

/** Types / categories (counts respect "all") */
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
      (
        $regionSlug == "all" ||
        area->region->slug.current == $regionSlug
      ) &&
      references(^._id)
    ]),
  }[count > 0] | order(name asc)
`;

export async function fetchSchoolFilterQuery(params: SchoolFilterQueryParams) {
  const query = groq`{
    "region": ${regionBaseQuery},
    "totalSchools": ${totalSchoolsQuery},
    "totalSchoolsFiltered": ${totalSchoolsFilteredQuery},
    "mainAreas": ${mainAreasQuery},
    "otherAreas": ${otherAreasQuery},
    "tags": ${tagsQuery},
    "types": ${typesQuery}
  }`;

  const safeParams = {
    ...params,
    areas: params.areas ?? [],
    types: params.types ?? [],
    tags: params.tags ?? [],
  };

  return client.fetch<SchoolFilterModel>(query, safeParams);
}
