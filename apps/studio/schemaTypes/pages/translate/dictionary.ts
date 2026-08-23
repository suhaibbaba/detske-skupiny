import { defineType, defineField } from "sanity";
import { LOCALES } from "@detske-skupiny/config/locales";

export default defineType({
  name: "dictionaries",
  title: "Dictionary",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Home Page",
    }),
    defineField({
      name: "entries",
      title: "Entries",
      type: "array",
      of: [
        {
          type: "object",
          name: "entry",
          fields: [
            defineField({
              name: "keyword",
              title: "Keyword",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            ...LOCALES.map((loc) =>
              defineField({
                name: loc.id,
                title: loc.title,
                type: "string",
              }),
            ),
          ],
          preview: {
            select: { title: "keyword" },
            prepare({ title }) {
              return {
                title,
              };
            },
          },
        },
      ],
    }),
  ],
});
