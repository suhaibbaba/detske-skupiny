import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
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
      description:
        "The area this subarea sits in. The whole chain above it - area, region, country - is composed from this one reference.",
      validation: (Rule) =>
        Rule.required().error(
          "A subarea with no area has no URL: the catalog builds its path from the chain above it.",
        ),
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
  /** The two levels above, so the row reads "Praha 6 · Praha". */
  preview: {
    select: {
      title: "name",
      area: "area.name",
      region: "area.region.name",
      language: "language",
    },
    prepare({ title, area, region, language }) {
      return {
        title: title || "Unnamed subarea",
        subtitle: localizedSubtitle(language, area ?? "No area", region),
        media: PinMapIcon,
      };
    },
  },
});
