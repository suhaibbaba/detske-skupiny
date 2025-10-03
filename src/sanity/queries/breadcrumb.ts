import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { BreadcrumbItem, BreadcrumbParams } from "@/sanity/types";

export async function fetchBreadcrumbList(params: BreadcrumbParams) {
  const query = groq`*[slug.current in $slugs]{
      _type,
      "slug": slug.current,
      name,
      language,
    }`;

  return await client.fetch<BreadcrumbItem[]>(query, params);
}
