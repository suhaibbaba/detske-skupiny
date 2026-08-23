import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "latestSchoolCollection",
  title: "Latest School Collection",
  type: "object",
  fields: [
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
    defineField({
      name: "cta",
      title: "CTA Button",
      type: "cta",
    }),
  ],
  preview: {
    select: { title: "title", language: "language" },
    prepare: ({ title, language }) => ({
      title,
      subtitle: appendLanguageSubtitle(language),
    }),
  },
});
