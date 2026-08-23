import { defineType, defineField } from "sanity";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "contactUsItem",
  type: "object",
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
    select: { title: "title", image: "image", language: "language" },
    prepare({ title, image, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(language),
        media: image,
      };
    },
  },
});
