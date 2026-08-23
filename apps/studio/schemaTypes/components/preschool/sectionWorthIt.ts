import { defineType, defineField, defineArrayMember } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { appendLanguageSubtitle } from "@/utility";

export default defineType({
  name: "sectionWorthIt",
  title: "What Makes It Worth It (Section)",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "What Makes It Worth It?",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      description: "Short intro under the heading.",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "features",
      title: "Feature Cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "featureCard",
          title: "Feature Card",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              validation: (r) => r.required().max(400),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description", media: "icon" },
          },
        }),
      ],
      validation: (r) => r.min(3).max(6),
    }),
  ],
  preview: {
    select: { title: "heading", features: "features", language: "language" },
    prepare({ title, features, language }) {
      const count = (features || []).length;
      return {
        title: title || "Worth It Section",
        subtitle: appendLanguageSubtitle(
          language,
          `${count ?? 0} feature${count === 1 ? "" : "s"}`,
        ),
      };
    },
  },
});
