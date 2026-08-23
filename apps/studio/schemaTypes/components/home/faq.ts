import { defineType, defineField, defineArrayMember } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "faq",
  type: "object",
  title: "FAQ",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "FAQ Items",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items", language: "language" },
    prepare({ title, items, language }) {
      const count = items?.length || 0;
      return {
        title,
        subtitle: appendLanguageSubtitle(language, `${count ?? 0} item(s)`),
      };
    },
  },
});
