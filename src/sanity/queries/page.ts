import { groq } from "next-sanity";
import { client } from "../client";

export async function fetchPageByType(
  type: string,
  params: { locale: string },
) {
  const query = groq`*[_type == $type && language == $locale][0]{ 
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
