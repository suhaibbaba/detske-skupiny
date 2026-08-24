import { groq } from "next-sanity";
import { MiniSchool, PageHero, School } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  imageUrl,
  internalLinkFields,
  linkFields,
  pageHeroFields,
  schoolCardFields,
  schoolCategoryFields,
  tagFields,
} from "@/lib/sanity/fragments";

export const miniSchoolsQuery = groq`{
    "schools": *[_type == "schools" && ${languageQuery} && (true in types[]->highPriority)] | order(sortOrder asc)[0...$numberOfSchools] {
      ${schoolCardFields}
    },
  }`;

export async function fetchMiniSchools(params: {
  numberOfSchools: number;
  locale: string;
}) {
  return sanityFetch<{ schools: MiniSchool[] }>(
    miniSchoolsQuery,
    { ...params },
    ["schools"],
  );
}

export const schoolBySlugQuery = groq`{
    "pageHero": *[_type == "schoolPage" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },
    "school": *[_type == "schools" && ${languageQuery} &&  slug.current == $slug][0]{
      "id": _id,
      ${imageUrl("logo")},
      name,
      metaDescription,
      "slug": slug.current,
      website{ ${linkFields} },
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
        "internalLink": link.internalLink->{ ${internalLinkFields} },
      },
      types[]->{
        "id": _id,
        name,
        "slug": slug.current
      },
      categories[]->{ ${schoolCategoryFields} },
      transportation[]{
        "id": _key,
        ...
      },
      content,
      tags[]->{ ${tagFields} },
    }
  }`;

export async function fetchSchoolBySlug(params: {
  slug: string;
  locale: string;
}) {
  return sanityFetch<{ pageHero: PageHero; school: School }>(
    schoolBySlugQuery,
    { ...params },
    ["schools", "page:schoolPage"],
  );
}
