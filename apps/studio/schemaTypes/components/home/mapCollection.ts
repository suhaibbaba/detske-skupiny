import { defineType, defineField, defineArrayMember } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "mapCollection",
  title: "Map Collection",
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
      name: "regions",
      type: "array",
      title: "Regions",
      of: [{ type: "reference", to: [{ type: "regions" }] }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "defaultCenter",
      title: "Default Map Center",
      type: "geopoint",
      validation: (r) => r.required(),
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
