import { defineField, defineType } from "sanity";
import {
  appendLanguageSubtitle,
  createSections,
  injectLanguage,
} from "@/utility";
import { widgetsName } from "@/schemaTypes/components/home";

export default defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Home Page",
    }),
    injectLanguage(),
    createSections(widgetsName),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      return {
        title: title || "Home Page",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
