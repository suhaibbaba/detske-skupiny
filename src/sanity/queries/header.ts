import { groq } from "next-sanity";
import { languageQuery } from "@/sanity/queries/index";
import { Header } from "@/types/header";
import { clientFetch, sanityFetch } from "@/sanity/utilites/fetch";

export async function fetchHeaderPage() {
  const query = groq`{
    "header": *[_type == "header" && ${languageQuery}][0]{
      "logo": logo.asset->url,
      menuItems[]{
        _type,
        "id": _key,
        link,
      },
      cta,
    }
}`;

  return sanityFetch<{
    header?: Header;
  }>(query);
}
