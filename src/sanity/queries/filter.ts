import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { QueryParams } from "@/sanity/types";

export async function fetchFilterQuery(params: QueryParams & { slug: string }) {
  const query = groq`
    *[_type == "region" && slug.current == $slug && language == $locale][0]{
      _id,
      name,
      "slug": slug.current,
      "totalSchools": count(*[
        _type == "school" &&
        area->region->slug.current == $slug &&
        language == $locale
      ]),
      "mainAreas": *[
        _type == "area" &&
        region->slug.current == $slug &&
        coalesce(isMain, false) == true &&
        language == $locale
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
        language == $locale
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
        _id,
        name,
        "slug": slug.current,
        "count": count(*[
          _type == "school" &&
          area->region->slug.current == $slug &&
          references(^._id) &&
          language == $locale
        ])
      }[count > 0] | order(name asc),
      
      "types": *[_type == "schoolType" && language == $locale]{
        _id,
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
