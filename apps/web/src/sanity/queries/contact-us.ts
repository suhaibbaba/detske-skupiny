import { groq } from "next-sanity";
import { ContactUsForm, ContactUsItem, PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchContactUs() {
  const query = groq`*[_type == "contactUs" && ${languageQuery}][0]{ 
      pageHero,
      items,
      contactForm,
    }`;

  return clientFetch<{
    pageHero: PageHero;
    items: ContactUsItem[];
    contactForm: ContactUsForm;
  }>(query);
}
