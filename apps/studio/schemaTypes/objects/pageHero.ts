import { defineType, defineField } from "sanity";

export default defineType({
  name: "pageHero",
  title: "Page Hero",
  type: "object",
  options: {
    collapsible: false,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctas",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "cta" }],
    }),
  ],
});
