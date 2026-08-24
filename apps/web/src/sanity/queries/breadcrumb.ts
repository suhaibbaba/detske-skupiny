import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  BreadcrumbItem,
  BreadcrumbParams,
  SchoolBreadcrumbParams,
} from "@/sanity/types";

export const breadcrumbListQuery = defineQuery(`*[slug.current in $slugs]{
      _type,
      "slug": slug.current,
      "name": coalesce(name, title, ""),
      language,
    }`);

/**
 * Matches on slug across every document type, so it is invalidated by any of
 * the content tags rather than one of them.
 */
export async function fetchBreadcrumbList(params: BreadcrumbParams) {
  return sanityFetch<BreadcrumbItem[]>(breadcrumbListQuery, { ...params }, [
    "schools",
    "geo",
    "blogs",
  ]);
}

export const schoolBreadcrumbQuery =
  defineQuery(`*[_type == "schools" && slug.current == $slug && defined(area)][0]{
      _type,
      "breadcrumb": [
        {
          "name": area->region->country->name,
          "slug": countrySlug,
        },
        {
          "name": area->region->name,
          "slug": "/" + countrySlug + "/" + regionSlug,
        },
        {
          "name": area->name,
          // Composed rather than read from the area's own removed fullSlug
          // field; the school already carries the two slugs above it.
          "slug": "/" + countrySlug + "/" + regionSlug + "/" + area->slug.current,
        },
        {
          "name": name,
          "slug": slug.current,
        }
      ]
    }`);

export async function fetchSchoolBreadcrumb(
  params: SchoolBreadcrumbParams,
): Promise<{ name: string; slug: string }[]> {
  const result = await sanityFetch<{
    breadcrumb?: { name: string; slug: string }[];
  } | null>(schoolBreadcrumbQuery, { ...params }, ["schools", "geo"]);

  return result?.breadcrumb || [];
}
