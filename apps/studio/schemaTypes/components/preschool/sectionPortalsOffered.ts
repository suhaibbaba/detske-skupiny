import { defineType, defineField, defineArrayMember } from "sanity";
import { StarIcon } from "@sanity/icons/Star";
import { countLabel, subtitle } from "@/utility";

export default defineType({
  name: "sectionPortalsOffered",
  title: "Portals Offered (Section)",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Portals Offered",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "portals",
      title: "Portal List",
      type: "array",
      of: [
        defineArrayMember({
          name: "portal",
          title: "Portal",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Portal Title",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "cta",
      title: "CTA Button",
      type: "cta",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "heading", portals: "portals" },
    prepare({ title, portals }) {
      return {
        title: title || "Portals offered",
        subtitle: subtitle("Portals offered", countLabel(portals, "portal")),
        media: StarIcon,
      };
    },
  },
});
