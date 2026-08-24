import { groq } from "next-sanity";
import { Blog } from "@/types/blog";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import { imageUrl } from "@/lib/sanity/fragments";

export const blogBySlugQuery = groq`{
    "blog":*[_type == "blogs" && ${languageQuery} && slug.current == $slug][0]{
      "id": _id,
      title,
      excerpt,
      "slug": slug.current,
      ${imageUrl("image")},
      readTime,
      publishedAt,
      content,
      category->{
        "id": _id,
        name,
      },
      author->{
        "id": _id,
        name,
        ${imageUrl("avatar", "image")},
        bio
      }
    },
  }`;

export async function fetchBlogBySlug(params: {
  slug: string;
  locale: string;
}) {
  return sanityFetch<{ blog: Blog }>(blogBySlugQuery, { ...params }, ["blogs"]);
}
