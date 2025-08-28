import { groq } from "next-sanity";
import { client } from "../client";
import { languageQuery } from "@/sanity/queries/index";
import { PageSections } from "@/sanity/types";

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

  return client.fetch<PageSections>(query, {
    type,
    ...params,
  });
}
