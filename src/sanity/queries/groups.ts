import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { GroupsProps } from "@/app/[locale]/groups/groupsPageClient";
import { QueryParams } from "@/sanity/types";

export async function fetchGroupPage(params: QueryParams) {
  const query = groq`{
    "regions": *[_type == "region" && language == $locale]{
      name,
      "slug": slug.current,
      "backgroundCover": backgroundCover.asset->url,
      "areas": *[_type == "area" && language == $locale && references(^._id)]{
        _id,
        name,
        "slug": slug.current,
        "schoolCount": count(*[_type == "school" && language == $locale && references(^._id)])
      },
      "totalSchools": count(*[_type == "school" && language == $locale && area->region._ref == ^._id ]),
      "schoolTypes": *[_type == "schoolType" && language == $locale]{
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
    "content": *[_type == "group" && language == $locale][0]{
      title,
      description,
      ctas[]{text, url,variant,openInNewTab},
    }
  }
`;

  return client.fetch<GroupsProps>(query, params);
}
