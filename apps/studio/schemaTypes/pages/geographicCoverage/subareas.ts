import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import PinMapIcon from "@/icons/PinMap";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "subareas",
  title: "SubAreas",
  type: "document",
  icon: PinMapIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "SubArea Name",
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
      name: "area",
      title: "Area",
      type: "reference",
      to: [{ type: "areas" }],
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "countrySlug",
      type: "string",
      title: "Country Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region->country",
    },
    {
      name: "regionSlug",
      type: "string",
      title: "Region Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region",
    },
    orderRankField({
      type: "subareas",
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
