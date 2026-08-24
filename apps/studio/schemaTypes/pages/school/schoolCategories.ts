import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
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
  /**
   * `emoji` is an image field despite the name, and it is what the site shows
   * beside a category - so it is the row's media here too, and a category
   * without one is visibly a category the catalog will render bare.
   */
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      media: "emoji",
      language: "language",
    },
    prepare({ title, slug, media, language }) {
      return {
        title: title || "Unnamed category",
        subtitle: localizedSubtitle(language, slug),
        media: media || ComponentIcon,
      };
    },
  },
});
