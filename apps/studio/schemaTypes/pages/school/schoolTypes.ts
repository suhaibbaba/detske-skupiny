import { defineType, defineField } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage } from "@/utility";
import * as process from "node:process";
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
  preview: {
    select: {
      title: "name",
      highPriority: "highPriority",
      media: "icon",
      language: "language",
    },
    prepare({ title, highPriority, media, language }) {
      return {
        title,
        subtitle: appendLanguageSubtitle(
          language,
          highPriority ? "High Priority" : "",
        ),
        media,
      };
    },
  },
});
