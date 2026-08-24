import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage } from "@/utility";
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
      description: "As it should read in the catalog's breadcrumb.",
      validation: (Rule) =>
        Rule.required().error(
          "Every level of the geography tree needs a name.",
        ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The first segment of every catalog URL beneath this country. Changing it moves every region, area and subarea under it.",
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
  /**
   * The top of the tree, so the subtitle is the path the site serves it at
   * rather than a parent it does not have. A country whose slug is missing is
   * a country whose catalog pages 404, which is worth seeing in the list.
   *
   * Deliberately not a school count. A count would be a `count(*[...])` per
   * row, issued again on every keystroke of a search - and the number the site
   * shows is computed once per page by the web app's own query, so a second
   * one here would be both slower and a second source of truth.
   */
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      media: "backgroundCover",
      language: "language",
    },
    prepare({ title, slug, media, language }) {
      return {
        title: title || "Unnamed country",
        subtitle: localizedSubtitle(language, slug ? `/${slug}` : "No slug"),
        media: media || EarthGlobeIcon,
      };
    },
  },
});
