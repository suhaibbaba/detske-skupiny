import { defineType, defineField } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { ThListIcon } from "@sanity/icons/ThList";

export default defineType({
  name: "schoolPage",
  title: "School Page",
  type: "document",
  icon: ThListIcon,
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
        subtitle: languageName(language),
        media: ThListIcon,
      };
    },
  },
});
