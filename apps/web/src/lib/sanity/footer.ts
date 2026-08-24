import { defineQuery } from "next-sanity";
import { languageQuery } from "@/lib/sanity/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import { linkField } from "@/lib/sanity/fragments";
import type { FooterQueryResult } from "@detske-skupiny/types";

export const footerQuery = defineQuery(`
  {
    "footer": *[_type == "footer" && ${languageQuery}][0] {
      _id,
      logo,
      columns[] {
        title,
        content[] {
          _type,
          _type == "textItem" => {
            text
          },
          _type == "linkItem" => {
            ${linkField},
          }
        }
      },
      copyright,
    }
  }
`);

export async function fetchFooterPage(locale: string) {
  return sanityFetch<FooterQueryResult>(footerQuery, { locale }, ["settings"]);
}
