import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchFilterQuery(params: QueryParams & { slug: string }) {
  const query = groq`
    *[_type == "region" && slug.current == $slug && ${languageQuery}][0]{
      _id,
      name,
      "slug": slug.current,
      "totalSchools": count(*[
        _type == "school" &&
        area->region->slug.current == $slug &&
        ${languageQuery}
      ]),
      "mainAreas": *[
        _type == "area" &&
        region->slug.current == $slug &&
        coalesce(isMain, false) == true &&
        ${languageQuery}
      ]{
        _id,
        name,
        "slug": slug.current,
        "count": count(*[
          _type == "school" &&
          area._ref == ^._id
        ])
      } | order(name asc),
      "otherAreas": *[
        _type == "area" &&
        region->slug.current == $slug &&
        coalesce(isMain, false) != true &&
        ${languageQuery}
      ]{
        _id,
        name,
        "slug": slug.current,
        "count": count(*[
          _type == "school" &&
          area._ref == ^._id
        ])
      } | order(name asc),
      
      "tags": *[_type == "tag"]{
        "id": _id,
        name,
        "slug": slug.current,
        "count": count(*[
          _type == "school" &&
          area->region->slug.current == $slug &&
          references(^._id) &&
          ${languageQuery}
        ])
      }[count > 0] | order(name asc),
      
      "types": *[_type == "schoolType" && ${languageQuery}]{
        "id": _id,
        name,
        "slug": slug.current,
        "emoji": emoji.asset->url,
        "count": count(*[
          _type == "school" &&
          area->region->slug.current == $slug &&
          references(^._id)         // school.types[] -> schoolType
        ])
      }[count > 0] | order(name asc)
  }
`;
  return client.fetch(query, params);
}
