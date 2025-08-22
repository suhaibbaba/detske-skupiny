import { groq } from "next-sanity";
import { client } from "../client";
import { directFieldsProjection, sectionsProjection } from "./sections.groq";
import { Region, SanityCtaField, SanityRichTextField } from "@/sanity/types";

export async function getPageByType(type: string) {
  const query = groq`*[_type == $type][0]{ title, ${sectionsProjection} }`;
  return client.fetch<{ title?: string; sections?: any[] }>(query, { type });
}

export async function getDirectPageByType(type: string) {
  const query = groq`*[_type == $type][0]{ title, ${directFieldsProjection} }`;
  return client.fetch<{ title?: string }>(query, { type });
}

export async function getGroups() {
  const query = groq`{
  "regions": *[_type == "region"]{
    name,
    "slug": slug.current,
    "backgroundCover": backgroundCover.asset->url,

    "areas": *[_type == "area" && references(^._id)]{
      _id,
      name,
      "slug": slug.current,
      "schoolCount": count(*[_type == "school" && references(^._id)])
    },

    "totalSchools": count(*[
      _type == "school" &&
      area->region._ref == ^._id
    ]),

    "schoolTypes": *[_type == "schoolType"]{
      name,
      "slug": slug.current,
      "emoji": emoji.asset->url,
      "schoolCount": count(*[
        _type == "school" &&
        area->region._ref == ^.^._id &&
        references(^._id)
      ])
    }
  },

  "content": *[_type == "group"][0]{
    title,
    description,
    ctas[]{text, url,variant,openInNewTab},
  }
}`;

  return client.fetch<{
    content: {
      title: string;
      description: SanityRichTextField;
      ctas: SanityCtaField[];
    };
    regions: Region[];
  }>(query);
}

export async function getFilterQuery(regionSlug: string) {
  const query = groq`
*[_type == "region" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,

  // Totals for "All"
  "totalSchools": count(*[
    _type == "school" &&
    area->region->slug.current == $slug
  ]),

  // MAIN AREAS (isMain == true)
  "mainAreas": *[
    _type == "area" &&
    region->slug.current == $slug &&
    coalesce(isMain, false) == true
  ]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area._ref == ^._id
    ])
  } | order(name asc),

  // OTHER AREAS (isMain != true)
  "otherAreas": *[
    _type == "area" &&
    region->slug.current == $slug &&
    coalesce(isMain, false) != true
  ]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area._ref == ^._id
    ])
  } | order(name asc),

  // TAGS that actually exist in this region (with counts)
  "tags": *[_type == "tag"]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area->region->slug.current == $slug &&
      references(^._id)         // school.tags[] -> tag
    ])
  }[count > 0] | order(name asc),

  // TYPES (kinder types) that exist in this region (with counts)
  "types": *[_type == "schoolType"]{
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
}`;
  return client.fetch(query, { slug: regionSlug });
}
