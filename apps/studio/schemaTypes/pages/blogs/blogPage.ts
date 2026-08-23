import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";

export default defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  fields: [
    defineField({
      name: "pageHero",
      type: "pageHero",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "blogCategories" }],
        },
      ],
      validation: (r) => r.required().min(1), // at least one category required
    }),
    injectLanguage(),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare({ language }) {
      return {
        title: "Blog Page",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
