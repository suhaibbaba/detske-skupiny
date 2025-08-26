import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { Author, Blog, BlogPageContent } from "@/types/blog";
import { QueryParams } from "@/sanity/types";

export async function fetchBlogPage(params: QueryParams) {
  const query = groq`{
    "content": *[_type == "blog" && language == $locale][0]{
      title,
      description,
      ctas[]{ text, url, variant, openInNewTab }
    },
    "categories": array::unique(*[_type == "blog" && language == $locale].categories[]),
    "blogs": *[_type == "blogDetails" && language == $locale] | order(publishedAt desc){
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
    "writers": *[_type == "author" && language == $locale]{
      name,
      role,
      "image": avatar.asset->url,
    } | order(blogCount desc)[0..7]
  }`;

  return client.fetch<{
    content: BlogPageContent;
    categories: string[];
    blogs: Blog[];
    writers: Author[];
  }>(query, params);
}
