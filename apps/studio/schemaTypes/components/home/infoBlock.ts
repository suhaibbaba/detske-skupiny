import { appendLanguageSubtitle, toPlainText } from "@/utility";
import { PortableTextBlock } from "@portabletext/types";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "infoBlock",
  type: "object",
  title: "Info Block",
  fields: [
    defineField({
      name: "image",
      type: "image",
      title: "Image",
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
    defineField({
      name: "cta",
      title: "CTA Button",
      type: "cta",
    }),
  ],
  preview: {
    select: {
      titleBlocks: "title",
      language: "language",
    },
    prepare({ titleBlocks, language }) {
      return {
        title: toPlainText(titleBlocks) || "Neighbour Kinder Group",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
