import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { Author, Blog, BlogCategory, MiniBlog } from "@/types/blog";
import { PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchBlogPage(params: QueryParams) {
  const query = groq`{
    "content": *[_type == "blog" && ${languageQuery}][0].pageHero,
    "categories": *[_type == "blog" && ${languageQuery}].categories[]->{
      "id": _id,
      name,
      "slug": slug.current
    },
    "blogs": *[_type == "blogs" && ${languageQuery}] | order(publishedAt desc){
      "id": _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": image.asset->url,
      readTime,
      publishedAt,
      category,
      author->{
        "id": _id,
        name,
        "image": avatar.asset->url,
        bio
      }
    },
    "writers": *[_type == "authors" && ${languageQuery}]{
      "id": _id,
      name,
      role,
      "image": avatar.asset->url,
    } | order(blogCount desc)[0..7]
  }`;

  return client.fetch<{
    content?: PageHero;
    categories?: BlogCategory[];
    blogs?: Blog[];
    writers?: Author[];
  }>(query, params);
}

export async function fetchMiniBlogs(
  params: QueryParams & { numberOfBlogs: number },
) {
  const query = groq`{
    "blogs": *[_type == "blogs" && ${languageQuery}][0...$numberOfBlogs] | order(publishedAt desc){
      "id": _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": image.asset->url,
      readTime,
      publishedAt,
      author->{
        "id": _id,
        name,
        "image": avatar.asset->url,
        "slug": slug.current,
      }
    },
  }`;

  return client.fetch<{
    blogs?: MiniBlog[];
  }>(query, params);
}
