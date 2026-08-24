import { defineType, defineField } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { ThLargeIcon } from "@sanity/icons/ThLarge";

export default defineType({
  name: "group",
  title: "Group Page",
  type: "document",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "pageHero",
      type: "pageHero",
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Group Page",
        subtitle: languageName(language),
        media: ThLargeIcon,
      };
    },
  },
});
