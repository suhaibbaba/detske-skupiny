import { defineType, defineArrayMember, defineField } from "sanity";
import { ColorWheelIcon } from "@sanity/icons/ColorWheel";

export const richText = defineType({
  name: "richText",
  type: "array",
  title: "Rich Text",
  of: [
    defineArrayMember({
      type: "block",
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL or email",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel", "/"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: true,
              }),
            ],
          }),
          defineArrayMember({
            name: "color",
            type: "object",
            title: "Color",
            icon: ColorWheelIcon,
            fields: [
              defineField({
                name: "color",
                type: "color",
                title: "Color",
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Important for SEO and accessibility",
        }),
        defineField({
          name: "maxWidth",
          title: "Max Width",
          type: "number",
          description: "Maximum width in pixels (optional)",
          validation: (Rule) => Rule.min(1).max(2000),
        }),
        defineField({
          name: "maxHeight",
          title: "Max Height",
          type: "number",
          description: "Maximum height in pixels (optional)",
          validation: (Rule) => Rule.min(1).max(2000),
        }),
      ],
      preview: {
        select: {
          asset: "asset",
          alt: "alt",
          maxWidth: "maxWidth",
          maxHeight: "maxHeight",
        },
        prepare({ asset, alt, maxWidth, maxHeight }) {
          const dimensions = [];
          if (maxWidth) dimensions.push(`W: ${maxWidth}px`);
          if (maxHeight) dimensions.push(`H: ${maxHeight}px`);

          return {
            title: alt || "Image",
            subtitle:
              dimensions.length > 0
                ? dimensions.join(" × ")
                : "No size constraints",
            media: asset,
          };
        },
      },
    }),
    defineArrayMember({ type: "checklist" }),
    defineArrayMember({ type: "spacer" }),
    defineArrayMember({ type: "gallery" }),
    defineArrayMember({ type: "table" }),
    defineArrayMember({ type: "gridBlock" }),
  ],
});

export default richText;
