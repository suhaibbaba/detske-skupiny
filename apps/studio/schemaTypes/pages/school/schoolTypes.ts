import { defineType, defineField } from "sanity";
import { localizedSubtitle, injectLanguage } from "@/utility";
import { StackIcon } from "@sanity/icons/Stack";

export default defineType({
  name: "schoolTypes",
  title: "School Types",
  type: "document",
  icon: StackIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "highPriority",
      title: "High Priority",
      type: "boolean",
      initialValue: false,
      description: "Mark as high priority (only one type can be high priority)",
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show or hide in the UI",
    }),
    defineField({
      name: "icon",
      type: "image",
      description: "Optional icon shown in UI",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "color",
      initialValue: {},
    }),
    injectLanguage(),
  ],
  /**
   * Both flags, not just one. `visibility` is off by exception and a hidden
   * type silently disappears from every filter on the site, so "Hidden" is the
   * most important thing a row can say - it was not said anywhere before.
   */
  preview: {
    select: {
      title: "name",
      highPriority: "highPriority",
      visibility: "visibility",
      media: "icon",
      language: "language",
    },
    prepare({ title, highPriority, visibility, media, language }) {
      return {
        title: title || "Unnamed type",
        subtitle: localizedSubtitle(
          language,
          visibility === false && "Hidden",
          highPriority && "High priority",
        ),
        media: media || StackIcon,
      };
    },
  },
});
