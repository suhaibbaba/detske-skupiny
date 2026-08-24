import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { EditIcon } from "@sanity/icons/Edit";

export default defineType({
  name: "authors",
  title: "Authors",
  type: "document",
  icon: EditIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "e.g. Professional Writer, Editor, Teacher",
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
    select: { title: "name", language: "language" },
    prepare({ title, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
