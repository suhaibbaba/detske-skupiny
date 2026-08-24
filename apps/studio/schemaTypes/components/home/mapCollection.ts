import { defineType, defineField, defineArrayMember } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";

export default defineType({
  name: "mapCollection",
  title: "Map Collection",
  type: "object",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "regions",
      type: "array",
      title: "Regions",
      of: [{ type: "reference", to: [{ type: "regions" }] }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "defaultCenter",
      title: "Default Map Center",
      type: "geopoint",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title || "Map",
      media: EarthGlobeIcon,
      subtitle: "Map of schools",
    }),
  },
});
