import { defineType, defineField } from "sanity";
import { toPlainText } from "@/utility";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";

export default defineType({
  name: "contactUsItem",
  type: "object",
  icon: InfoOutlineIcon,
  title: "Contact Us Item",
  fields: [
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required().min(5),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title", description: "description", image: "image" },
    prepare({ title, description, image }) {
      return {
        title: title || "Contact item",
        subtitle: toPlainText(description),
        media: image || InfoOutlineIcon,
      };
    },
  },
});
