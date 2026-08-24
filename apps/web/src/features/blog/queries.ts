import { defineQuery } from "next-sanity";
import { Blog, BlogCategory, MiniBlog } from "@/types/blog";
import { PageHero } from "@/types";
import { languageQuery } from "@/lib/sanity/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  imageUrl,
  imageUrlAs,
  imageUrlWithLqip,
  pageHeroFields,
  translationSlugs,
} from "@/lib/sanity/fragments";

const blogCardFields = `
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  ${imageUrl("image")},
  readTime,
  publishedAt
`;

export const blogPageQuery = defineQuery(`{
    "pageHero": *[_type == "blogPage" && ${languageQuery}][0].pageHero{ ${pageHeroFields} },
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
      ${blogCardFields},
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
    }
  }`);

export async function fetchBlogPage(params: {
  categorySelected?: string;
  locale: string;
}) {
  return sanityFetch<{
    pageHero?: PageHero;
    categories?: BlogCategory[];
    blogs?: Blog[];
  }>(
    blogPageQuery,
    {
      categorySelected: params.categorySelected ?? null,
      locale: params.locale,
    },
    ["blogs", "page:blogPage"],
  );
}

export const miniBlogsQuery = defineQuery(`{
    "blogs": *[_type == "blogs" && ${languageQuery}][0...$numberOfBlogs] | order(publishedAt desc){
      ${blogCardFields},
      author->{
        "id": _id,
        name,
        ${imageUrlAs("avatar", "image")},
        "slug": slug.current,
      }
    },
  }`);

export async function fetchMiniBlogs(params: {
  numberOfBlogs: number;
  locale: string;
}) {
  return sanityFetch<{ blogs?: MiniBlog[] }>(miniBlogsQuery, { ...params }, [
    "blogs",
  ]);
}

// ========================== the article page ======================

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
