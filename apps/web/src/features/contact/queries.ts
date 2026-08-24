import { defineQuery } from "next-sanity";
import { ContactUsForm, ContactUsItem, PageHero } from "@/types";
import { languageQuery } from "@/lib/sanity/filters";
import { sanityFetch } from "@/lib/sanity/fetch";
import { ctaFields, pageHeroFields } from "@/lib/sanity/fragments";

export const contactUsQuery =
  defineQuery(`*[_type == "contactUs" && ${languageQuery}][0]{
      pageHero{ ${pageHeroFields} },
      items,
      contactForm{
        ...,
        sendMessageCta{ ${ctaFields} },
      },
    }`);

export async function fetchContactUs(locale: string) {
  return sanityFetch<{
    pageHero: PageHero;
    items: ContactUsItem[];
    contactForm: ContactUsForm;
  }>(contactUsQuery, { locale }, ["page:contactUs"]);
}
