import { defineType, defineField } from "sanity";

export default defineType({
  name: "transportItem",
  title: "Transportation Nearby",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Stop / Station",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "distance",
      title: "Distance (e.g., 200m)",
      type: "string",
    }),
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: { list: ["Bus", "Metro", "Tram", "Train"], layout: "radio" },
    }),
  ],
  preview: { select: { title: "name", subtitle: "distance" } },
});
