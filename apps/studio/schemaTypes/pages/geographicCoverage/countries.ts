import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "countries",
  title: "Countries",
  type: "document",
  icon: EarthGlobeIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Country Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: (value, context) => context.defaultIsUnique(value, context), // Default behavior
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundCover",
      title: "Background Cover",
      type: "image",
      options: { hotspot: true },
    }),
    orderRankField({
      type: "countries",
    }),
    injectLanguage(),
  ],
  preview: {
    select: { title: "name", language: "language" },
    prepare({ title, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
