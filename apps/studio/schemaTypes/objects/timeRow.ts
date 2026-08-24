import { defineType, defineField } from "sanity";
import { ClockIcon } from "@sanity/icons/Clock";

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
  /** The whole span, not just the start: a row is "06:30-08:30". */
  preview: {
    select: { title: "activity", start: "start", end: "end" },
    prepare({ title, start, end }) {
      return {
        title: title || "No activity",
        subtitle: start && end ? `${start}-${end}` : (start ?? end),
        media: ClockIcon,
      };
    },
  },
});
