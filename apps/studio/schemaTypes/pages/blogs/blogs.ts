import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { ThListIcon } from "@sanity/icons/ThList";

export default defineType({
  name: "blogs",
  title: "Blogs",
  type: "document",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: (value, context) => context.defaultIsUnique(value, context), // Default behavior
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary for previews and SEO.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "authors" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Estimated Read Time (minutes)",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategories" }],
      validation: (rule) => rule.required(),
    }),
    injectLanguage(),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      author: "author.name",
      language: "language",
    },
    prepare({ title, media, author, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(
          language,
          author ? `By ${author}` : "No author",
        ),
        media,
      };
    },
  },
});
