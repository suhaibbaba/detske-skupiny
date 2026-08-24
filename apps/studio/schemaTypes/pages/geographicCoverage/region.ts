// /schemaTypes/documents/region.ts
import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
import WorldLocation from "@/icons/WorldLocation";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export default defineType({
  name: "regions",
  title: "Regions",
  type: "document",
  icon: WorldLocation,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: "name",
      title: "Region Name",
      type: "string",
      validation: (r) => r.required(),
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
      name: "country",
      title: "Country",
      type: "reference",
      to: [{ type: "countries" }],
      description:
        "The country this region sits in. It is half of the region's URL and how the catalog finds it, so a region without one is unreachable.",
      validation: (Rule) =>
        Rule.required().error(
          "A region with no country has no place in the catalog tree and no URL to be served at.",
        ),
    }),
    defineField({
      name: "backgroundCover",
      title: "Background Cover",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "countrySlug",
      type: "string",
      title: "Country Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region->country",
    }),
    orderRankField({
      type: "regions",
    }),
    injectLanguage(),
  ],
  /**
   * The subtitle is the level above: which country this region belongs to. In
   * the drill-down that is the pane you came from, but a region also shows up
   * in reference pickers and search results, where it is the only thing that
   * tells two similarly named regions apart.
   */
  preview: {
    select: {
      title: "name",
      country: "country.name",
      media: "backgroundCover",
      language: "language",
    },
    prepare({ title, country, media, language }) {
      return {
        title: title || "Unnamed region",
        subtitle: localizedSubtitle(language, country ?? "No country"),
        media: media || WorldLocation,
      };
    },
  },
});
