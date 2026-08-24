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
      description:
        "The post's headline. It is the link text everywhere the post is listed and the tab title when it is open, so write it to make sense on its own.",
      validation: (rule) =>
        rule.required().error("A post cannot be published without a headline."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The post's address on the site, generated from the headline. Changing it after publishing breaks every link that already points here.",
      options: {
        source: "title",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: (value, context) => context.defaultIsUnique(value, context), // Default behavior
      },
      validation: (rule) =>
        rule
          .required()
          .error(
            "Without a slug this post has no address and nothing can link to it. Press Generate to take one from the headline.",
          ),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      description:
        "Shown above the post and on every card that lists it. Landscape; a post without one renders as a plain block of text in the article grid.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "One or two sentences under the headline in listings, and the description search engines show. Without it they quote the first sentence of the article instead, which is rarely the right sentence.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "authors" }],
      description:
        "Who wrote it. Their name and avatar are shown on the post; create the author first if they are not in the list.",
      validation: (rule) =>
        rule
          .required()
          .error(
            "Every post is bylined, so the page has nowhere to render without an author.",
          ),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description:
        "The date shown on the post and the one the article list is ordered by. Defaults to now; back-date it if the post was written earlier.",
      validation: (rule) =>
        rule
          .required()
          .error(
            "The article list is ordered by this date, so a post without one sorts to an arbitrary place in it.",
          ),
    }),
    defineField({
      name: "readTime",
      title: "Estimated Read Time (minutes)",
      type: "number",
      description:
        "Whole minutes, shown beside the date. Roughly 200 words a minute.",
      validation: (rule) =>
        rule
          .required()
          .error("Shown on every card, so it cannot be left empty.")
          .min(1)
          .error("A post takes at least a minute to read."),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      description: "The article itself.",
      validation: (rule) =>
        rule.required().error("There is no post without a body."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategories" }],
      description:
        "The one category this post files under. It is the filter readers use on the article list.",
      validation: (rule) =>
        rule
          .required()
          .error(
            "The article list filters by category, so an uncategorised post is invisible to anyone using that filter.",
          ),
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
