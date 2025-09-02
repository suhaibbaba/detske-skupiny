import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { Header } from "@/types/header";

export async function fetchHeaderPage(params: QueryParams) {
  const query = groq`{
    "header": *[_type == "header" && ${languageQuery}][0]{
      "logo": logo.asset->url,
      menuItems[]{
        "id": _key,
        name,
        className,
        _type
      },
      cta,
    }
}`;

  return client.fetch<{
    header?: Header;
  }>(query, params);
}
