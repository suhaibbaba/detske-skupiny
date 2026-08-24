import { groq } from "next-sanity";
import { Author, Blog, BlogCategory, MiniBlog } from "@/types/blog";
import { PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import { imageUrl, pageHeroFields } from "@/lib/sanity/fragments";

const blogCardFields = groq`
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  ${imageUrl("image")},
  readTime,
  publishedAt
`;

export const blogPageQuery = groq`{
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
        ${imageUrl("avatar", "image")},
        bio
      }
    }
  }`;

export async function fetchBlogPage(params: {
  categorySelected?: string;
  locale: string;
}) {
  return sanityFetch<{
    pageHero?: PageHero;
    categories?: BlogCategory[];
    blogs?: Blog[];
    writers?: Author[];
  }>(
    blogPageQuery,
    {
      categorySelected: params.categorySelected ?? null,
      locale: params.locale,
    },
    ["blogs", "page:blogPage"],
  );
}

export const miniBlogsQuery = groq`{
    "blogs": *[_type == "blogs" && ${languageQuery}][0...$numberOfBlogs] | order(publishedAt desc){
      ${blogCardFields},
      author->{
        "id": _id,
        name,
        ${imageUrl("avatar", "image")},
        "slug": slug.current,
      }
    },
  }`;

export async function fetchMiniBlogs(params: {
  numberOfBlogs: number;
  locale: string;
}) {
  return sanityFetch<{ blogs?: MiniBlog[] }>(miniBlogsQuery, { ...params }, [
    "blogs",
  ]);
}
