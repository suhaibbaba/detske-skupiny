import { defineQuery } from "next-sanity";
import { languageQuery } from "@/lib/sanity/filters";
import type { HeaderQueryResult } from "@detske-skupiny/types";
import { sanityFetch } from "@/lib/sanity/fetch";
import { ctaFields, imageUrl, linkField } from "@/lib/sanity/fragments";

export const headerQuery = defineQuery(`{
    "header": *[_type == "header" && ${languageQuery}][0]{
      ${imageUrl("logo")},
      ${imageUrl("logoInverse")},
      menuItems[]{
        _type,
        "id": _key,
        ${linkField},
      },
      cta{ ${ctaFields} },
    }
}`);

export async function fetchHeaderPage(locale: string) {
  return sanityFetch<HeaderQueryResult>(headerQuery, { locale }, ["settings"]);
}
