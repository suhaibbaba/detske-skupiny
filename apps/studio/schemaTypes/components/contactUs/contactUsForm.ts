import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "contactUsForm",
  type: "object",
  title: "Contact Us Form",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "privacyPolicy",
      title: "Privacy Policy",
      type: "richText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sendMessageCta",
      title: "Send Message CTA",
      type: "cta",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
