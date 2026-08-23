import { defineType, defineField } from "sanity";
import { injectLanguage } from "@/utility";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page Title",
      validation: (r) => r.required(),
    }),
    injectLanguage(),
  ],
});
