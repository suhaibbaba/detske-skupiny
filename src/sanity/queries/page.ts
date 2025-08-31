import { groq } from "next-sanity";
import { languageQuery } from "@/sanity/queries/index";
import { PageSections } from "@/sanity/types";
import { sanityFetch } from "@/sanity/utilites/fetch";

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

  return sanityFetch<PageSections>(query, {
    type,
    ...params,
  });
}
