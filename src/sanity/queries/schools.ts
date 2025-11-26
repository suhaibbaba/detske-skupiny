import { groq } from "next-sanity";
import { MiniSchool, PageHero, School } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchMiniSchools(params: { numberOfSchools: number }) {
  const query = groq`{
    "schools": *[_type == "schools" && ${languageQuery}] | order((defined(types[0]->highPriority) && types[0]->highPriority == true) desc)[0...$numberOfSchools] {
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
      },
      types[]->{
        "id": _id,
        name,
        highPriority,
        "icon": icon.asset->url,
        "backgroundColor": backgroundColor.hex,
      },
      categories[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "emoji": emoji.asset->url,
      },
    },
  }`;

  return clientFetch<{
    schools: MiniSchool[];
  }>(query, { ...params });
}

export async function fetchSchoolBySlug(params: { slug: string }) {
  const query = groq`{
    "pageHero": *[_type == "schoolPage" && ${languageQuery}][0].pageHero,
    "school": *[_type == "schools" && ${languageQuery} &&  slug.current == $slug][0]{
      "id": _id,
      "logo": logo.asset->url,
      name,
      "slug": slug.current,
      website,
      "primaryImages": primaryImages[].asset->url,
      "primaryImage": select(defined(primaryImages[0].asset) => primaryImages[0].asset->url, null),
      "region": area->region->{ "id": _id, name, countrySlug, fullSlug },
      capacity,
      providerName,
      area->{ "id": _id, name, fullSlug },
      address,
      location,
      cin,
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
      categories[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "emoji": emoji.asset->url,
      },
      transportation[]{
        "id": _key,
        ...
      },
      content,
      tags[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      },
    }
  }`;

  return clientFetch<{
    pageHero: PageHero;
    school: School;
  }>(query, { ...params });
}
