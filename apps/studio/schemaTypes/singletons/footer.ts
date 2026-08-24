import { defineType, defineField, defineArrayMember } from "sanity";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { LinkIcon } from "@sanity/icons/Link";

export default defineType({
  name: "footer",
  title: "Footer Page",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "columns",
      title: "Footer Columns",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerColumn",
          title: "Column",
          fields: [
            {
              name: "title",
              title: "Column Title",
              type: "string",
              description: "e.g., HEAD OFFICE, ARTICLES, TYPES OF SCHOOLS",
            },
            {
              name: "content",
              title: "Column Content",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "textItem",
                  title: "Text Item",
                  fields: [
                    {
                      name: "text",
                      title: "Text",
                      type: "text",
                      rows: 2,
                    },
                  ],
                  preview: {
                    select: {
                      title: "text",
                    },
                  },
                },
                {
                  type: "object",
                  name: "linkItem",
                  title: "Link Item",
                  fields: [
                    {
                      name: "link",
                      title: "URL",
                      type: "link",
                      options: {
                        enableText: true,
                      },
                    },
                  ],
                  preview: {
                    select: {
                      title: "link.text",
                      subtitle: "link.href",
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        },
      ],
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Footer Page",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
