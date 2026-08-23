import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { TagsIcon } from "@sanity/icons";

export default defineType({
  name: "schoolTags",
  title: "School Tags",
  type: "document",
  icon: TagsIcon,
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
      name: "borderColor",
      title: "Border Color",
      type: "color",
      initialValue: {
        hex: "#9980B0",
      },
    }),
    injectLanguage(),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
      language: "language",
    },
    prepare({ title, subtitle, language }) {
      return {
        title: title,
        subtitle: appendLanguageSubtitle(language, subtitle),
      };
    },
  },
});
