import { defineType, defineField, defineArrayMember } from "sanity";
import { countLabel, subtitle } from "@/utility";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export default defineType({
  name: "faq",
  type: "object",
  icon: HelpCircleIcon,
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
    select: { title: "title", items: "items" },
    prepare({ title, items }) {
      return {
        title: title || "FAQ",
        media: HelpCircleIcon,
        subtitle: subtitle("FAQ", countLabel(items, "question")),
      };
    },
  },
});
