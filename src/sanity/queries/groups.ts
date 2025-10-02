import { groq } from "next-sanity";
import { GroupPage, PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchGroupPage() {
  const query = groq /* GraphQL */ `{
    "content": *[_type == "group" && ${languageQuery}][0].pageHero,
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
    } + [
          *[
              _type == "countries" &&
              (!defined(language) || language == $locale)
            ][0]{
              "id": _id,
              "name": name,
              "slug": slug.current,
              "backgroundCover": backgroundCover.asset->url,
            
              // total schools in the country
              "totalSchools": count(*[
                _type == "schools" &&
                (!defined(language) || language == $locale) &&
                references(^._id)
              ]),
            
              // all regions belonging to this country
              "areas": *[
                _type == "regions" &&
                (!defined(language) || language == $locale) &&
                country._ref == ^._id
              ]{
                "id": _id,
                "name": name,
                "slug": "/" + country->slug.current + "/" + slug.current,
                "schoolCount": count(*[
                  _type == "schools" &&
                  (!defined(language) || language == $locale) &&
                  area->region._ref == ^._id
                ]),
              },
  
              // all school categories in this country
              "schoolCategories": *[
                _type == "schoolCategories" &&
                (!defined(language) || language == $locale)
              ]{
                "id": _id,
                "name": name,
                "slug": slug.current,
                "emoji": emoji.asset->url,
                "schoolCount": count(*[
                  _type == "schools" &&
                  (!defined(language) || language == $locale) &&
                  references(^._id)
                ])
              }
          }
    ],
  }
`;

  return clientFetch<{
    groups?: GroupPage[];
    content?: PageHero;
  }>(query);
}
