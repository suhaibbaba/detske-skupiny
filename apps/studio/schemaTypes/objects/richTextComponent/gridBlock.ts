import { defineType, defineField } from "sanity";
import { BlockElementIcon } from "@sanity/icons";

export default defineType({
  name: "gridBlock",
  title: "Grid Block",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "columns",
      title: "Number of Columns",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(12),
      initialValue: 2,
      description: "How many columns in this grid (1-12)",
    }),
    defineField({
      name: "items",
      title: "Grid Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "gridItem",
          fields: [
            defineField({
              name: "type",
              title: "Content Type",
              type: "string",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Text", value: "text" },
                ],
                layout: "radio",
              },
              initialValue: "image",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative Text",
                  type: "string",
                }),
                defineField({
                  name: "maxWidth",
                  title: "Max Width",
                  type: "number",
                  validation: (Rule) => Rule.min(100).max(1000),
                }),
              ],
              hidden: ({ parent }) => parent?.type !== "image",
              validation: (Rule) =>
                Rule.custom((image, context) => {
                  const parent = context.parent as any;
                  if (parent?.type === "image" && !image) {
                    return "Image is required when type is Image";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "text",
              title: "Text Content",
              type: "richText",
              hidden: ({ parent }) => parent?.type !== "text",
            }),
            defineField({
              name: "horizontalAlign",
              title: "Horizontal Alignment",
              type: "string",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Center", value: "center" },
                  { title: "Right", value: "right" },
                ],
                layout: "radio",
              },
              initialValue: "left",
              description: "How to align content horizontally within this item",
            }),
            defineField({
              name: "verticalAlign",
              title: "Vertical Alignment",
              type: "string",
              options: {
                list: [
                  { title: "Top", value: "start" },
                  { title: "Center", value: "center" },
                  { title: "Bottom", value: "end" },
                ],
                layout: "radio",
              },
              initialValue: "start",
              description: "How to align content vertically within this item",
            }),
          ],
          preview: {
            select: {
              type: "type",
              image: "image",
              text: "text",
            },
            prepare({ type, image, text }) {
              const icon = type === "image" ? "📷" : "📝";
              const textPreview = text?.[0]?.children?.[0]?.text;
              const subtitle =
                type === "text" && textPreview
                  ? textPreview.substring(0, 40) + "..."
                  : type === "image"
                    ? "Image"
                    : "Empty";

              return {
                title: icon,
                subtitle,
                media: type === "image" ? image : undefined,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "gap",
      title: "Gap Between Items",
      type: "string",
      options: {
        list: [
          { title: "None", value: "0" },
          { title: "Small", value: "2" },
          { title: "Medium", value: "4" },
          { title: "Large", value: "6" },
          { title: "Extra Large", value: "8" },
        ],
        layout: "dropdown",
      },
      initialValue: "4",
    }),
    defineField({
      name: "margin",
      title: "Margin",
      type: "number",
      description: "Margin around the grid block for y-axis",
      initialValue: 4,
    }),
    defineField({
      name: "verticalAlign",
      title: "Vertical Alignment",
      type: "string",
      options: {
        list: [
          { title: "Top", value: "start" },
          { title: "Center", value: "center" },
          { title: "Bottom", value: "end" },
          { title: "Stretch", value: "stretch" },
        ],
        layout: "radio",
      },
      initialValue: "start",
    }),
    defineField({
      name: "mobileColumns",
      title: "Mobile Columns",
      type: "number",
      description: "Number of columns on mobile devices",
      validation: (Rule) => Rule.min(1).max(4),
      initialValue: 1,
    }),
    defineField({
      name: "tabletColumns",
      title: "Tablet Columns",
      type: "number",
      description: "Number of columns on tablet devices",
      validation: (Rule) => Rule.min(1).max(6),
      initialValue: 2,
    }),
  ],
  preview: {
    select: {
      columns: "columns",
      items: "items",
    },
    prepare({ columns, items }) {
      const itemCount = items?.length || 0;
      return {
        title: `Grid: ${columns} columns`,
        subtitle: `${itemCount} item(s)`,
      };
    },
  },
});
