import { defineQuery } from "next-sanity";
import { GroupPage, PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  areaPath,
  imageUrl,
  pageHeroFields,
  regionPath,
  schoolCountForArea,
  schoolCountForCountry,
  schoolCountForRegion,
} from "@/lib/sanity/fragments";

/**
 * Per-category school counts, resolved by GROQ rather than in JavaScript.
 *
 * This used to pull every school document in the dataset - `regionRef` and
 * `categoryRefs` for all of them - and tally the pairs in a JS loop. The
 * counts are the only thing that survived that transfer, so `count()` does the
 * same work at the database and returns integers.
 *
 * `^` walks out one scope per level: inside the count filter it is the
 * category being projected, `^.^` the region around it.
 */
const categoryCountsForRegion = `
  "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
    "id": _id,
    name,
    "slug": slug.current,
    ${imageUrl("emoji")},
    "schoolCount": count(*[
      _type == "schools" &&
      ${languageQuery} &&
      area->region._ref == ^.^._id &&
      ^._id in categories[]._ref
    ])
  }
`;

/**
 * The same counts for the country row, which is the sum over every region.
 *
 * `defined(area->region._ref)` keeps it equal to the old JS total: that loop
 * skipped schools with no region, so they were never part of any sum.
 */
const categoryCountsForCountry = `
  "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
    "id": _id,
    name,
    "slug": slug.current,
    ${imageUrl("emoji")},
    "schoolCount": count(*[
      _type == "schools" &&
      ${languageQuery} &&
      defined(area->region._ref) &&
      ^._id in categories[]._ref
    ])
  }
`;

export const groupPageQuery = defineQuery(`{
    "content": *[_type == "group" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },

    "regions": *[_type == "regions" && ${languageQuery}]{
      "id": _id,
      "totalSchools": ${schoolCountForRegion},
      name,
      "slug": ${regionPath},
      ${imageUrl("backgroundCover")},
      "regionRef": _id,
      "areas": *[_type == "areas" && ${languageQuery} && region._ref == ^._id]{
        "id": _id,
        name,
        "slug": ${areaPath},
        "schoolCount": ${schoolCountForArea},
        "regionRef": region._ref
      },
      ${categoryCountsForRegion}
    },

    "country": *[_type == "countries" && ${languageQuery}][0]{
      "id": _id,
      name,
      "slug": slug.current,
      ${imageUrl("backgroundCover")},
      "totalSchools": ${schoolCountForCountry},
      "areas": *[_type == "regions" && ${languageQuery}]{
        "id": _id,
        name,
        "slug": ${regionPath},
        "schoolCount": ${schoolCountForRegion}
      },
      ${categoryCountsForCountry}
    }
  }`);

export async function fetchGroupPage(locale: string) {
  const data = await sanityFetch<{
    content?: PageHero;
    regions?: GroupPage[];
    country?: GroupPage;
  }>(groupPageQuery, { locale }, ["schools", "geo", "page:group"]);

  if (!data.regions) return { content: data.content };

  // The country row is rendered as one more group, after the regions.
  const groups: GroupPage[] = data.country
    ? [...data.regions, data.country]
    : data.regions;

  return { groups, content: data.content };
}
