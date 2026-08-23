import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";

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
});
