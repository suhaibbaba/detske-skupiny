import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons/Star";

export default defineType({
  name: "featureItem",
  type: "object",
  icon: StarIcon,
  title: "Feature Item",
  fields: [
    defineField({
      name: "icon",
      type: "image",
      title: "Icon",
      options: { hotspot: true },
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
  ],
  preview: {
    select: { title: "title", description: "description", media: "icon" },
    prepare: ({ title, description, media }) => ({
      title: title || "Untitled feature",
      subtitle: description,
      media: media || StarIcon,
    }),
  },
});
