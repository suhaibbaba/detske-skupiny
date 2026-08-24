import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { ComponentIcon } from "@sanity/icons/Component";

export default defineType({
  name: "schoolCategories",
  title: "School Categories",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: (value, context) => context.defaultIsUnique(value, context), // Default behavior
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "emoji",
      type: "image",
      description: "Optional emoji shown in UI",
    }),
    injectLanguage(),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current", language: "language" },
    prepare({ title, subtitle, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(language, subtitle),
      };
    },
  },
});
