import { widgetsName } from "@/schemaTypes/components/preschool";
import { defineType } from "sanity";
import { languageName, createSections, injectLanguage } from "@/utility";
import { UsersIcon } from "@sanity/icons/Users";

export default defineType({
  name: "preschool",
  title: "Pre-School Page",
  type: "document",
  icon: UsersIcon,
  fields: [createSections(widgetsName), injectLanguage()],
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      return {
        title: "Pre-School Page",
        subtitle: languageName(language),
        media: UsersIcon,
      };
    },
  },
});
