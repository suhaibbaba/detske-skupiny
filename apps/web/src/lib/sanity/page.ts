import { defineQuery } from "next-sanity";
import { excludeDraft, languageQuery } from "@/lib/sanity/filters";
import type { PageByTypeQueryResult } from "@detske-skupiny/types";
import { sanityFetch } from "@/lib/sanity/fetch";
import { markerFields, sectionLinkFields } from "@/lib/sanity/fragments";

export const pageByTypeQuery =
  defineQuery(`*[_type == $type && ${languageQuery}][0]{
      title,
      sections[]{
        ...,
        ${sectionLinkFields},
        _type == "mapCollection" => {
          ...,
          ${sectionLinkFields},
          "markers": *[_type == "schools" && ${excludeDraft} && ${languageQuery}]{
            ${markerFields},
            "selectedRegionId": area->region->_id,
          },
          "regions": regions[]->{
            "id": _id,
            name,
          },
        },
      },
    }
  `);

/**
 * Tagged "schools" as well as the page itself: the mapCollection section
 * embeds every school as a marker, so publishing a school changes this
 * response even though no page document is touched.
 */
export async function fetchPageByType(type: string, locale: string) {
  return sanityFetch<PageByTypeQueryResult>(pageByTypeQuery, { type, locale }, [
    `page:${type}`,
    "schools",
  ]);
}
