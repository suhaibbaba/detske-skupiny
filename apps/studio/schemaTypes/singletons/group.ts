import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";

export default defineType({
  name: "group",
  title: "Group Page",
  type: "document",
  fields: [
    defineField({
      name: "pageHero",
      type: "pageHero",
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Group Page",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
