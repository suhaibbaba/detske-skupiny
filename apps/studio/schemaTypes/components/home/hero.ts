import { appendLanguageSubtitle, toPlainText } from "@/utility";
import { PortableTextBlock } from "@portabletext/types";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  type: "object",
  title: "Hero Section",
  fields: [
    defineField({
      name: "title",
      type: "richText",
      title: "Title",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "ctas",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "cta" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: toPlainText(title) || "Hero",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
