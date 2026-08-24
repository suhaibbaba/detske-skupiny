import { defineType, defineField } from "sanity";
import { LOCALES } from "@detske-skupiny/config/locales";
import { StringIcon } from "@sanity/icons/String";
import { BASE_LANGUAGE, countLabel, subtitle } from "@/utility";

export default defineType({
  name: "dictionaries",
  title: "Dictionary",
  type: "document",
  icon: StringIcon,
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
          /**
           * A keyword on its own says nothing about whether it has been
           * translated, which is the only question worth asking of a row here.
           * So the row shows the base-language string beside the keyword, and
           * the languages that are still empty.
           */
          preview: {
            select: {
              title: "keyword",
              ...Object.fromEntries(LOCALES.map((loc) => [loc.id, loc.id])),
            },
            prepare(values) {
              const missing = LOCALES.filter((loc) => !values[loc.id]).map(
                (loc) => loc.id.toUpperCase(),
              );

              return {
                title: values.title || "No keyword",
                subtitle: subtitle(
                  values[BASE_LANGUAGE],
                  missing.length > 0 && `missing ${missing.join(", ")}`,
                ),
              };
            },
          },
        },
      ],
    }),
  ],
  /**
   * One document, so this preview is only ever seen as the row that opens it -
   * where the useful thing to know is how big the table has got. `entries` is
   * the document's own array, so the count is of a value already in hand, not
   * a query.
   */
  preview: {
    select: { entries: "entries" },
    prepare({ entries }) {
      return {
        title: "Dictionary",
        subtitle: countLabel(entries, "entry", "entries"),
        media: StringIcon,
      };
    },
  },
});
