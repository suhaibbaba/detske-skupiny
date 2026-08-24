import { defineType, defineField, defineArrayMember } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

export default defineType({
  name: "contactUs",
  title: "Contact Us",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "pageHero",
      type: "pageHero",
    }),
    defineField({
      name: "items",
      title: "Contact Us Items",
      type: "array",
      of: [defineArrayMember({ type: "contactUsItem" })],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "contactForm",
      type: "contactUsForm",
      options: {
        collapsed: true,
        collapsible: true,
      },
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Contact Us Page",
        subtitle: languageName(language),
        media: EnvelopeIcon,
      };
    },
  },
});
