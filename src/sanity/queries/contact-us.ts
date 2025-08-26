import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { ContactUsItem, PageHero, QueryParams } from "@/sanity/types";

export async function fetchContactUs(params: QueryParams) {
  const query = groq`*[_type == "contactUs" && language == $locale][0]{ 
      pageHero,
      items,
    }`;

  return client.fetch<{
    pageHero: PageHero;
    items: ContactUsItem[];
  }>(query, params);
}
