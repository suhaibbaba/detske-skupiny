import { widgetsName } from "@/schemaTypes/components/preschool";
import { defineType } from "sanity";
import {
  appendLanguageSubtitle,
  createSections,
  injectLanguage,
} from "@/utility";

export default defineType({
  name: "preschool",
  title: "Pre-School Page",
  type: "document",
  fields: [createSections(widgetsName), injectLanguage()],
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      return {
        title: "Pre-School Page",
        subtitle: appendLanguageSubtitle(language),
      };
    },
  },
});
