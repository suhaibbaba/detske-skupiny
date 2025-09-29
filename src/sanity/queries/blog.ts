import { groq } from "next-sanity";
import { Author, Blog, BlogCategory, MiniBlog } from "@/types/blog";
import { PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchBlogPage(params: { categorySelected?: string }) {
  const query = groq`{
    "content": *[_type == "blog" && ${languageQuery}][0].pageHero,
    "categories": *[_type == "blogCategories" && ${languageQuery}] {
      "id": _id,
      name,
      "slug": slug.current
    },
    "blogs": *[
      _type == "blogs" &&
      ${languageQuery} &&
      (
        !defined($categorySelected) || 
        $categorySelected == "" ||
        category->slug.current == $categorySelected
      )
    ] | order(publishedAt desc){
      "id": _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": image.asset->url,
      readTime,
      publishedAt,
      category->{
        "id": _id,
        name,
      },
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

  return clientFetch<{
    content?: PageHero;
    categories?: BlogCategory[];
    blogs?: Blog[];
    writers?: Author[];
  }>(query, { ...params });
}

export async function fetchMiniBlogs(params: { numberOfBlogs: number }) {
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

  return clientFetch<{
    blogs?: MiniBlog[];
  }>(query, { ...params });
}
