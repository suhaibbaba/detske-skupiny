import { defineField, defineType } from "sanity";
import { languageName, createSections, injectLanguage } from "@/utility";
import { widgetsName } from "@/schemaTypes/components/home";
import { HomeIcon } from "@sanity/icons/Home";

export default defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
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
        subtitle: languageName(language),
        media: HomeIcon,
      };
    },
  },
});
