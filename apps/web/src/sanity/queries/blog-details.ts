import { defineQuery } from "next-sanity";
import { Blog } from "@/types/blog";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  imageUrl,
  imageUrlAs,
  imageUrlWithLqip,
  translationSlugs,
} from "@/lib/sanity/fragments";

export const blogBySlugQuery = defineQuery(`{
    "blog":*[_type == "blogs" && ${languageQuery} && slug.current == $slug][0]{
      "id": _id,
      title,
      excerpt,
      "slug": slug.current,
      ${imageUrlWithLqip("image")},
      readTime,
      publishedAt,
      "updatedAt": _updatedAt,
      ${translationSlugs},
      content,
      category->{
        "id": _id,
        name,
      },
      author->{
        "id": _id,
        name,
        ${imageUrlAs("avatar", "image")},
        bio
      }
    },
  }`);

export async function fetchBlogBySlug(params: {
  slug: string;
  locale: string;
}) {
  return sanityFetch<{ blog: Blog }>(blogBySlugQuery, { ...params }, ["blogs"]);
}
