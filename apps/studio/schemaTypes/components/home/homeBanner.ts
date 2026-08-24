import { defineType, defineField } from "sanity";
import { BillIcon } from "@sanity/icons/Bill";

export default defineType({
  name: "homeBanner",
  title: "Banner",
  type: "object",
  icon: BillIcon,
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
      name: "cta",
      title: "CTA Button",
      type: "cta",
    }),
    defineField({
      name: "background",
      title: "Background Image",
      type: "image",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Banner",
      media: BillIcon,
      subtitle: "Banner",
    }),
  },
});
