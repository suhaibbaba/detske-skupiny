import { groq } from "next-sanity";
import { Blog } from "@/types/blog";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchBlogBySlug(params: { slug: string }) {
  const query = groq`{
    "blog":*[_type == "blogs" && ${languageQuery} && slug.current == $slug][0]{
      "id": _id,
      title,
      excerpt,
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

  return clientFetch<{
    blog: Blog;
  }>(query, { ...params });
}
