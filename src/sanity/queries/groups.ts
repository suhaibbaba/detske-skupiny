import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { GroupsProps } from "@/app/[locale]/groups/groupsPageClient";
import { QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchGroupPage(params: QueryParams) {
  const query = groq`{
    "regions": *[_type == "region" && ${languageQuery}]{
      name,
      "slug": slug.current,
      "backgroundCover": backgroundCover.asset->url,
      "areas": *[_type == "area" && ${languageQuery} && references(^._id)]{
        _id,
        name,
        "slug": slug.current,
        "schoolCount": count(*[_type == "school" && ${languageQuery} && references(^._id)])
      },
      "totalSchools": count(*[_type == "school" && ${languageQuery} && area->region._ref == ^._id ]),
      "schoolTypes": *[_type == "schoolType" && ${languageQuery}]{
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
    "content": *[_type == "group" && ${languageQuery}][0]{
      title,
      description,
      ctas[]{text, url,variant,openInNewTab},
    }
  }
`;

  return client.fetch<GroupsProps>(query, params);
}
