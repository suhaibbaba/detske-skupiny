import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { GroupPage, PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchGroupPage(params: QueryParams) {
  const query = groq`{
    "groups": *[_type == "regions" && ${languageQuery}]{
      "id": _id,
      "totalSchools": count(*[_type == "schools" && ${languageQuery} && area->region._ref == ^._id ]),
      name,
      "slug": slug.current,
      "backgroundCover": backgroundCover.asset->url,
      "areas": *[_type == "areas" && ${languageQuery} && references(^._id) &&
        isMain == true]{
        "id": _id,
        name,
        "slug": slug.current,
        "schoolCount": count(*[_type == "schools" && ${languageQuery} && references(^._id)])
      },
      "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
        "id": _id,
        name,
        "slug": slug.current,
        "emoji": emoji.asset->url,
        "schoolCount": count(*[
          _type == "schools" &&
          area->region._ref == ^.^._id &&
          references(^._id)
        ])
      }
    },
    "content": *[_type == "group" && ${languageQuery}][0].pageHero,
  }
`;

  return client.fetch<{
    groups?: GroupPage[];
    content?: PageHero;
  }>(query, params);
}
