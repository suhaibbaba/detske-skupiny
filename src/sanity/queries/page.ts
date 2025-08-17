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
