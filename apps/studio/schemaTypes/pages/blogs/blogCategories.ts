import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
import { ComponentIcon } from "@sanity/icons/Component";

export default defineType({
  name: "blogCategories",
  title: "Blog Categories",
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
    injectLanguage(),
  ],
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      language: "language",
    },
    prepare({ title, slug, language }) {
      return {
        title: title || "Unnamed category",
        subtitle: localizedSubtitle(language, slug),
        media: ComponentIcon,
      };
    },
  },
});
