import { defineType, defineField } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export default defineType({
  name: "faqItem",
  type: "object",
  icon: HelpCircleIcon,
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
    select: { title: "question", answer: "answer" },
    prepare: ({ title, answer }) => ({
      title: title || "No question",
      media: HelpCircleIcon,
      subtitle: answer,
    }),
  },
});
