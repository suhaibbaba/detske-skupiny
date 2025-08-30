import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { MiniSchool, PageHero, SchoolFilterQueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchSchoolByFilter(params: SchoolFilterQueryParams) {
  const query = groq`{
    "pageHero": *[_type == "schoolList" && ${languageQuery}][0].pageHero,
    "schools": *[_type == "schools" && ${languageQuery} &&
      area->region->slug.current == $regionSlug &&
      (!defined($areas) || count($areas) == 0 || area->slug.current in $areas) &&
      (!defined($types) || count($types) == 0 || count(categories[@->slug.current in $types]) > 0) &&
      (!defined($tags)  || count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0)
    ] {
      "id": _id,
      name,
      "slug": slug.current,
      shortSummary,
      website,
      "primaryImage": select(
        defined(primaryImages[0]) => primaryImages[0].asset->url,
        null
      ),
      area->{ "id": _id, name},
      tags[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      },
      categories[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      }
    }
  }`;

  return client.fetch<{
    pageHero: PageHero;
    schools: MiniSchool[];
  }>(query, params);
}
