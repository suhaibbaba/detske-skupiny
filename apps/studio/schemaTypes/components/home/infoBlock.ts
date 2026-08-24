import { toPlainText } from "@/utility";
import { PortableTextBlock } from "@portabletext/types";
import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons/BlockContent";

export default defineType({
  name: "infoBlock",
  type: "object",
  icon: BlockContentIcon,
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
    select: { titleBlocks: "title" },
    prepare({ titleBlocks }) {
      return {
        title: toPlainText(titleBlocks) || "Info block",
        media: BlockContentIcon,
        subtitle: "Info block",
      };
    },
  },
});
