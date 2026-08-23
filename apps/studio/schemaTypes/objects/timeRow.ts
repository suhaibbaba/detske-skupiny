import { defineType, defineField } from "sanity";

export default defineType({
  name: "timeRow",
  title: "Time Table Row",
  type: "object",
  fields: [
    defineField({
      name: "start",
      type: "string",
      validation: (r) => r.required(),
      description: "e.g., 06:30",
    }),
    defineField({
      name: "end",
      type: "string",
      validation: (r) => r.required(),
      description: "e.g., 08:30",
    }),
    defineField({
      name: "activity",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "activity", subtitle: "start" } },
});
