import { groq } from "next-sanity";
import { languageQuery } from "@/sanity/queries/index";
import { Header } from "@/types/header";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchHeaderPage() {
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

  return clientFetch<{
    header?: Header;
  }>(query);
}
