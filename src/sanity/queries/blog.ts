import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { Author, Blog, BlogCategory } from "@/types/blog";
import { PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchBlogPage(params: QueryParams) {
  const query = groq`{
    "content": *[_type == "blog" && ${languageQuery}][0].pageHero,
    "categories": *[_type == "blog" && ${languageQuery}].categories[]->{
      name,
      "slug": slug.current
    },
    "blogs": *[_type == "blogDetails" && ${languageQuery}] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": image.asset->url,
      readTime,
      publishedAt,
      category,
      author->{
        _id,
        name,
        "image": avatar.asset->url,
        bio
      }
    },
    "writers": *[_type == "author" && ${languageQuery}]{
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
