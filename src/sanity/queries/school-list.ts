import { groq } from "next-sanity";
import { MiniSchool, PageHero, SchoolFilterQueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchSchoolByFilter(params: SchoolFilterQueryParams) {
  const query = groq`{
    "pageHero": *[_type == "schoolList" && ${languageQuery}][0].pageHero,
    "totalSchools": count(
      *[_type == "schools" && ${languageQuery} && 
        (!defined($country) || area->region->country->slug.current == $country) &&
        (!defined($region) || area->region->slug.current == $region)]
      ),
    "schools": *[
      _type == "schools" &&
      (language == $locale || !defined(language)) &&
      (!defined($country) || area->region->country->slug.current == $country) &&
      (!defined($region) || area->region->slug.current == $region) &&
      (!defined($area) || area->slug.current == $area) &&
      (!defined($subarea) || subarea->slug.current == $subarea) &&
      (!defined($types) || count($types) == 0 || count(categories[@->slug.current in $types]) > 0) &&
      (!defined($tags) || count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0) && 
      (!defined($search) || name match $search)
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

  return clientFetch<{
    pageHero: PageHero;
    totalSchools: number;
    schools: MiniSchool[];
  }>(query, {
    country: params.country ?? null,
    region: params.region ?? null,
    area: params.area ?? null,
    subarea: params.subarea ?? null,
    types: params.types ?? [],
    tags: params.tags ?? [],
    search: params.search ?? null,
  });
}
