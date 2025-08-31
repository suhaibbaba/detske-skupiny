import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { MiniSchool, PageHero, SchoolFilterQueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchSchoolByFilter(params: SchoolFilterQueryParams) {
  const query = groq`{
    "pageHero": *[_type == "schoolList" && ${languageQuery}][0].pageHero,
     "totalSchools": count(*[_type == "schools" && ${languageQuery}]),
    "schools": *[
      _type == "schools" &&
      ${languageQuery} &&
      ($regionSlug == "all" || area->region->slug.current == $regionSlug) &&
      (!defined($areas) || count($areas) == 0 || area->slug.current in $areas) &&
      (!defined($types) || count($types) == 0 || count(categories[@->slug.current in $types]) > 0) &&
      (!defined($tags) || count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0)
    ] {
      "id": _id,
      name,
      "logo": logo.asset->url,
      "slug": slug.current,
      shortSummary,
      website,
      "primaryImage": select(defined(primaryImages[0]) => primaryImages[0].asset->url, null),
      "region": area->region->{ "id": _id, name, "slug": slug.current },
      area->{ "id": _id, name, "slug": slug.current },
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
    totalSchools: number;
    schools: MiniSchool[];
  }>(query, params);
}
