import { defineType, defineField, defineArrayMember } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { LinkIcon } from "@sanity/icons/Link";
import { PanelLeftIcon } from "@sanity/icons/PanelLeft";

export default defineType({
  name: "header",
  title: "Header Page",
  type: "document",
  icon: PanelLeftIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Header Page",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "logoInverse",
      title: "Logo Inverse",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "menuItems",
      title: "Menu Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "plan",
          title: "Plan",
          fields: [
            defineField({
              name: "link",
              type: "link",
              options: {
                enableText: true,
              },
            }),
          ],
          preview: {
            select: { title: "link.text", link: "link" },
            prepare({ title, link }) {
              // Determine subtitle based on link type
              let subtitle = "";
              if (link.href) {
                subtitle = link.href;
              }

              return {
                title: title || "Untitled Link",
                subtitle: subtitle,
                media: LinkIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "cta",
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Header Page",
        subtitle: languageName(language),
        media: PanelLeftIcon,
      };
    },
  },
});
