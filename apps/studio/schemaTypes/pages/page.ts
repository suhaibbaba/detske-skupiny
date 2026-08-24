import { defineType, defineField } from "sanity";
import { injectLanguage, localizedSubtitle } from "@/utility";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page Title",
      validation: (r) => r.required(),
    }),
    injectLanguage(),
  ],
  /**
   * This type had no preview, so every standalone page rendered as
   * "Untitled" - Sanity's fallback when nothing tells it which field is the
   * title - and a list of them was indistinguishable rows.
   */
  preview: {
    select: { title: "title", language: "language" },
    prepare({ title, language }) {
      return {
        title: title || "Untitled page",
        subtitle: localizedSubtitle(language),
        media: DocumentTextIcon,
      };
    },
  },
});
