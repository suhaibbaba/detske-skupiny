import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { Blog, BlogCategory } from "@/types/blog";
import { PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchBlogDetailPage(
  params: QueryParams & { slug: string },
) {
  const query = groq`{
    "content": *[_type == "blog" && ${languageQuery}][0]{
      title,
      description,
      ctas[]{ text, url, variant, openInNewTab }
    },
    "categories": array::unique(*[_type == "blog" && ${languageQuery}].categories[]),
    "blog":*[_type == "blogDetails" && ${languageQuery} && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      "image": image.asset->url,
      readTime,
      publishedAt,
      content,
      author->{
        _id,
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
