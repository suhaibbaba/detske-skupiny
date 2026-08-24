import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
import { MarkerIcon } from "@sanity/icons/Marker";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "areas",
  title: "Areas",
  type: "document",
  icon: MarkerIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Area Name",
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
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "regions" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "countrySlug",
      type: "string",
      title: "Country Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region->country",
    }),
    defineField({
      name: "regionSlug",
      type: "string",
      title: "Region Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region->country",
    }),
    orderRankField({
      type: "areas",
    }),
    injectLanguage(),
  ],
  /** The two levels above, so the row reads "Praha · Česká republika". */
  preview: {
    select: {
      title: "name",
      region: "region.name",
      country: "region.country.name",
      language: "language",
    },
    prepare({ title, region, country, language }) {
      return {
        title: title || "Unnamed area",
        subtitle: localizedSubtitle(language, region ?? "No region", country),
        media: MarkerIcon,
      };
    },
  },
});
