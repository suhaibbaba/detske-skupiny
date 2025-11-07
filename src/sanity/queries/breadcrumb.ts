import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import {
  BreadcrumbItem,
  BreadcrumbParams,
  SchoolBreadcrumbParams,
} from "@/sanity/types";

export async function fetchBreadcrumbList(params: BreadcrumbParams) {
  const query = groq`*[slug.current in $slugs]{
      _type,
      "slug": slug.current,
      name,
      language,
    }`;

  return await client.fetch<BreadcrumbItem[]>(query, params);
}

export async function fetchSchoolBreadcrumb(
  params: SchoolBreadcrumbParams,
): Promise<{ name: string; slug: string }[]> {
  const query = groq`*[_type == "schools" && slug.current == $slug && defined(area)][0]{
      _type,
      "breadcrumb": [
        {
          "name": area->region->country->name,
          "slug": "/catalog/" + area->region->country->slug.current,
        },
        {
          "name": area->region->name,
          "slug": "/catalog/" + area->region->country->slug.current + "/" + area->region->slug.current,
        },
        {
          "name": area->name,
          "slug": "/catalog" + area->fullSlug,
        },
        {
          "name": name,
          "slug": slug.current,
        }
      ]
    } // null`;

  const result = await client.fetch(query, params);
  return result?.breadcrumb || [];
}
