import { defineType, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export default defineType({
  name: "gallery",
  type: "object",
  title: "Gallery",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "Additional photos (max 5)",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.max(5).error("Maximum 5 gallery images"),
    }),
  ],
  preview: {
    select: {
      images: "images",
    },
    prepare({ images }) {
      return {
        title: "Gallery",
        subtitle: `${images?.length || 0} image(s)`,
        media: images?.[0],
      };
    },
  },
});
