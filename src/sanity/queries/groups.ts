import { groq } from "next-sanity";
import { GroupPage, PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchGroupPage() {
  const query = groq`{
    "groups": *[_type == "regions" && ${languageQuery}]{
      "id": _id,
      "totalSchools": count(*[_type == "schools" && ${languageQuery} && area->region._ref == ^._id ]),
      name,
      "slug": "/" 
        + country->slug.current + "/" 
        + slug.current,
      "backgroundCover": backgroundCover.asset->url,
      "areas": *[_type == "areas" && ${languageQuery} && references(^._id)]{
        "id": _id,
        name,
        "slug": "/" 
          + region->country->slug.current + "/" 
          + region->slug.current + "/" 
          + slug.current,
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

  return clientFetch<{
    groups?: GroupPage[];
    content?: PageHero;
  }>(query);
}
