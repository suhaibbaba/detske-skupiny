import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { Blog, BlogCategory } from "@/types/blog";
import { PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchBlogBySlug(params: QueryParams & { slug: string }) {
  const query = groq`{
    "content": *[_type == "blog" && ${languageQuery}][0].pageHero,
    "categories": *[_type == "blog" && ${languageQuery}].categories[]->{
      "id": _id,
      name,
      "slug": slug.current
    },
    "blog":*[_type == "blogs" && ${languageQuery} && slug.current == $slug][0]{
      "id": _id,
      title,
      "slug": slug.current,
      "image": image.asset->url,
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
        "image": avatar.asset->url,
        bio
      }
    },
  }`;

  return client.fetch<{
    content: PageHero;
    categories?: BlogCategory[];
    blog: Blog;
  }>(query, params);
}
