import { defineType, defineField } from "sanity";
import { ThLargeIcon } from "@sanity/icons/ThLarge";

export default defineType({
  name: "table",
  title: "Table",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Table Heading",
      type: "string",
      description: "Optional heading for the table",
    }),
    defineField({
      name: "headers",
      title: "Column Headers",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).max(10),
      description: "Add column headers (max 10 columns)",
    }),
    defineField({
      name: "rows",
      title: "Table Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
              description: "Add cell values matching the number of headers",
            }),
          ],
          preview: {
            select: {
              cells: "cells",
            },
            prepare({ cells }) {
              return {
                title: cells?.join(" | ") || "Empty row",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "caption",
      title: "Table Caption",
      type: "text",
      rows: 2,
      description: "Optional caption or description",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      headers: "headers",
      rows: "rows",
    },
    prepare({ heading, headers, rows }) {
      return {
        title: heading || "Table",
        subtitle: `${headers?.length || 0} columns × ${rows?.length || 0} rows`,
        media: ThLargeIcon,
      };
    },
  },
});
