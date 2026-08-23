import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";

export default defineType({
  name: "schoolPage",
  title: "School Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "School List Page",
    }),
    defineField({
      name: "pageHero",
      type: "pageHero",
    }),
    injectLanguage(),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title,
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
