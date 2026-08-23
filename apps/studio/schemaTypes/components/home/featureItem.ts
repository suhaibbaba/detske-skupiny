import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "featureItem",
  type: "object",
  title: "Feature Item",
  fields: [
    defineField({
      name: "icon",
      type: "image",
      title: "Icon",
      options: { hotspot: true },
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "icon", language: "language" },
    prepare: ({ title, media, language }) => ({
      title,
      subtitle: appendLanguageSubtitle(language),
      media,
    }),
  },
});
