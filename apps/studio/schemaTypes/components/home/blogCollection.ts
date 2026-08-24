import { defineType, defineField } from "sanity";
import { EditIcon } from "@sanity/icons/Edit";

export default defineType({
  name: "blogCollection",
  title: "Blog Collection",
  type: "object",
  icon: EditIcon,
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
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Blog collection",
      media: EditIcon,
      subtitle: "Blog collection",
    }),
  },
});
