import { defineType, defineField } from "sanity";
import { ThListIcon } from "@sanity/icons/ThList";

export default defineType({
  name: "latestSchoolCollection",
  title: "Latest School Collection",
  type: "object",
  icon: ThListIcon,
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
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Latest schools",
      media: ThListIcon,
      subtitle: "Latest schools",
    }),
  },
});
