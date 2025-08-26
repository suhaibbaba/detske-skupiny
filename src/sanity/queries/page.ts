import { groq } from "next-sanity";
import { client } from "../client";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchPageByType(
  type: string,
  params: { locale: string },
) {
  const query = groq`*[_type == $type && ${languageQuery}][0]{ 
      title,
      sections[]{
        ...,
      }
    }
  `;

  return client.fetch<{ title?: string; sections?: any[] }>(query, {
    type,
    ...params,
  });
}
