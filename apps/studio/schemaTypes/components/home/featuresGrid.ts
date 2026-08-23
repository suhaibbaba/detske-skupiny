import { defineType, defineField, defineArrayMember } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "featuresGrid",
  type: "object",
  title: "Features Grid",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "items",
      type: "array",
      title: "Features",
      of: [defineArrayMember({ type: "featureItem" })],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items", language: "language" },
    prepare: ({ title, items, language }) => {
      const count = items?.length || 0;
      return {
        title,
        subtitle: appendLanguageSubtitle(language, `${count ?? 0} feature(s)`),
      };
    },
  },
});
