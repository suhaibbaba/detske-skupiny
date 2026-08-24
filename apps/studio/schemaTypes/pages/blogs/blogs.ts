import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { formatDate, injectLanguage, localizedSubtitle } from "@/utility";
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
  /**
   * A row in the post list.
   *
   * `media` selects `image`. It used to select `coverImage`, a field this type
   * has never had, so every post in every list showed the fallback icon and
   * the cover image the editor uploaded was visible nowhere but the document
   * itself.
   *
   * The subtitle is who and when, which is what tells two posts apart in a
   * list ordered by date.
   */
  preview: {
    select: {
      title: "title",
      media: "image",
      author: "author.name",
      publishedAt: "publishedAt",
      language: "language",
    },
    prepare({ title, media, author, publishedAt, language }) {
      return {
        title: title || "Untitled post",
        subtitle: localizedSubtitle(
          language,
          author ?? "No author",
          formatDate(publishedAt),
        ),
        media: media || ThListIcon,
      };
    },
  },
});
