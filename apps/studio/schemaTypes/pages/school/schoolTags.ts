import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
import { TagsIcon } from "@sanity/icons/Tags";

export default defineType({
  name: "schoolTags",
  title: "School Tags",
  type: "document",
  icon: TagsIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: (value, context) => context.defaultIsUnique(value, context), // Default behavior
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "borderColor",
      title: "Border Color",
      type: "color",
      initialValue: {
        hex: "#9980B0",
      },
    }),
    injectLanguage(),
  ],
  /**
   * A tag has no image, so the media slot carries the type icon and the colour
   * the site outlines the tag with goes in the subtitle - it is the only thing
   * that distinguishes two tags beyond their names, and getting it wrong is
   * only visible on the live site otherwise.
   */
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      borderColor: "borderColor.hex",
      language: "language",
    },
    prepare({ title, slug, borderColor, language }) {
      return {
        title: title || "Unnamed tag",
        subtitle: localizedSubtitle(language, slug, borderColor),
        media: TagsIcon,
      };
    },
  },
});
