import { defineType, defineField } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { EditIcon } from "@sanity/icons/Edit";

export default defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: EditIcon,
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
        subtitle: languageName(language),
        media: EditIcon,
      };
    },
  },
});
