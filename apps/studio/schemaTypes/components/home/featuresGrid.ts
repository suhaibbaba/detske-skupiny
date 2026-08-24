import { defineType, defineField, defineArrayMember } from "sanity";
import { countLabel, subtitle } from "@/utility";
import { ThLargeIcon } from "@sanity/icons/ThLarge";

export default defineType({
  name: "featuresGrid",
  type: "object",
  icon: ThLargeIcon,
  title: "Features Grid",
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
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      title: "Features",
      of: [defineArrayMember({ type: "featureItem" })],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Features grid",
      media: ThLargeIcon,
      subtitle: subtitle("Features grid", countLabel(items, "feature")),
    }),
  },
});
