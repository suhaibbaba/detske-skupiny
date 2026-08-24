import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
import { UserIcon } from "@sanity/icons/User";

export default defineType({
  name: "authors",
  title: "Authors",
  type: "document",
  icon: UserIcon,
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
  /**
   * The avatar is the fastest way to recognise an author, and it was not shown
   * anywhere: the preview selected the name and nothing else, so a list of
   * authors was a column of text with a column of identical placeholder icons
   * beside it.
   */
  preview: {
    select: {
      title: "name",
      media: "avatar",
      role: "role",
      language: "language",
    },
    prepare({ title, media, role, language }) {
      return {
        title: title || "Unnamed author",
        subtitle: localizedSubtitle(language, role),
        media: media || UserIcon,
      };
    },
  },
});
