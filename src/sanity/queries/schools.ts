import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { MiniSchool, PageHero, QueryParams, School } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchMiniSchools(
  params: QueryParams & { numberOfSchools: number },
) {
  const query = groq`{
    "schools": *[_type == "schools" && ${languageQuery}][0...$numberOfSchools] {
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
      "region": area->region->{ "id": _id, name},
      tags[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      }
    }
  }`;

  return client.fetch<{
    schools: MiniSchool[];
  }>(query, params);
}

export async function fetchSchoolBySlug(
  params: QueryParams & { slug: string },
) {
  const query = groq`{
    "pageHero": *[_type == "schoolList" && ${languageQuery}][0].pageHero,
    "school": *[_type == "schools" && ${languageQuery} &&  slug.current == $slug][0]{
      "id": _id,
      "logo": logo.asset->url,
      name,
      "slug": slug.current,
      website,
      "primaryImages": primaryImages[].asset->url,
      "primaryImage": select(defined(primaryImages[0].asset) => primaryImages[0].asset->url, null),
      "region": area->region->{ "id": _id, name},
      area->{ "id": _id, name },
      address,
      location,
      contacts[],
      links[]{
        "id": _key,
        ...link,
      },
      types[]->{
        "id": _id,
        name,
        "slug": slug.current
      },
      transportation[],
      about,
      highlights,
      timetable[],
      isPrivate,
      "gallery": gallery[].asset->url,
    }
  }`;

  return client.fetch<{
    pageHero: PageHero;
    school: School;
  }>(query, params);
}
