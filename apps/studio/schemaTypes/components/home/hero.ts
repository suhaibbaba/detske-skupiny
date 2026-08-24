import { toPlainText } from "@/utility";
import { PortableTextBlock } from "@portabletext/types";
import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export default defineType({
  name: "hero",
  type: "object",
  icon: ImagesIcon,
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
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return {
        title: toPlainText(title) || "Hero",
        subtitle: "Hero section",
        media: media || ImagesIcon,
      };
    },
  },
});
