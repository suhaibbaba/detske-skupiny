import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "faqItem",
  type: "object",
  title: "FAQ Item",
  fields: [
    defineField({
      name: "question",
      type: "string",
      title: "Question",
      validation: (r) => r.required().min(5),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "openByDefault",
      type: "boolean",
      title: "Open by default?",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "question", language: "language" },
    prepare: ({ title, language }) => ({
      title,
      subtitle: appendLanguageSubtitle(language),
    }),
  },
});
