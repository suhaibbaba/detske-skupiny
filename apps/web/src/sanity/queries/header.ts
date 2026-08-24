import { groq } from "next-sanity";
import { languageQuery } from "@/sanity/queries/filters";
import { Header } from "@/types/header";
import { sanityFetch } from "@/lib/sanity/fetch";
import { ctaFields, imageUrl, linkField } from "@/lib/sanity/fragments";

export const headerQuery = groq`{
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
}`;

export async function fetchHeaderPage(locale: string) {
  return sanityFetch<{ header?: Header }>(headerQuery, { locale }, [
    "settings",
  ]);
}
