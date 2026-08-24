import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

export default defineType({
  name: "listOfSchoolSection",
  title: "List Of School Section",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
    }),
    defineField({
      name: "cta",
      title: "Cta",
      type: "cta",
    }),
  ],
  /** Had no preview: the section's own heading is what identifies it. */
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return {
        title: title || "School list",
        subtitle: subtitle || "School list",
        media: TagIcon,
      };
    },
  },
});
