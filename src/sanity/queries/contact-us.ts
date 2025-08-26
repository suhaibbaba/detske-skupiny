import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { ContactUsItem, PageHero, QueryParams } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";

export async function fetchContactUs(params: QueryParams) {
  const query = groq`*[_type == "contactUs" && ${languageQuery}][0]{ 
      pageHero,
      items,
    }`;

  return client.fetch<{
    pageHero: PageHero;
    items: ContactUsItem[];
  }>(query, params);
}
