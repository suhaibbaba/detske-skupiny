import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { MiniSchool, QueryParams, School } from "@/sanity/types";

export async function fetchMiniSchools(
  params: QueryParams & { limit: number },
) {
  const query = groq`{
    "preschools": *[_type == "school" && language == $locale][0...$limit] {
      "id": _id,
      name,
      "slug": slug.current,
      "primaryImage": select(
        defined(primaryImages[0]) => primaryImages[0].asset->url,
        null
      ),
      area->{_id, name}
    }
  }`;

  return client.fetch<{
    preschools: MiniSchool[];
  }>(query, params);
}

export async function fetchSchoolBySlug(
  params: QueryParams & { slug: string },
) {
  const query = groq`{
    *[_type == "school" && language == $locale &&  slug.current == $slug][0]{
      "id": _id,
      "logo": logo.asset->url,
      name,
      "slug": slug.current,
      website,
      primaryImages[]{
        alt,
        caption,
        "url": select(defined(asset) => asset->url, null)
      },
      "primaryImage": select(defined(primaryImages[0].asset) => primaryImages[0].asset->url, null),
      area->{ _id, name },
      address,
      location,
      contacts[],
      links,
      types[]->{
        _id,
        name,
        "slug": slug.current
      },
      transportation[],
      about,
      highlights,
      timetable[],
      isPrivate,
      gallery[]{
        alt,
        caption,
        "url": select(defined(asset) => asset->url, null)
      }
    }
  `;
  return client.fetch<School>(query, params);
}
