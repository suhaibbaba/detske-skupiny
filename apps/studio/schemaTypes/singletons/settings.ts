import { defineType, defineField } from "sanity";
import { languageName, injectLanguage } from "@/utility";
import { ControlsIcon } from "@sanity/icons/Controls";

export default defineType({
  name: "settings",
  description: "Site Settings",
  type: "document",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      description:
        "The site's name, appended to every page title in the browser tab and in search results. There is one of these per language.",
    }),
    defineField({
      name: "defaultImage",
      type: "image",
      title: "Default Image",
      description:
        "Stands in wherever an image is expected and missing - a school with no photo, a post with no cover. It is what visitors see when an editor has not got there yet, so choose something neutral rather than something specific.",
    }),
    defineField({
      name: "supportEmail",
      title: "Support Email",
      type: "string",
      description:
        "The address the contact page and the footer send people to. A real inbox someone reads, not a personal one.",
    }),
    defineField({
      name: "officePhoneNumber",
      title: "Office Phone Number",
      type: "string",
      description:
        "Shown in the footer and on the contact page. Include the country code, e.g. +420 222 333 444.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media",
      type: "object",
      description:
        "The profiles linked from the footer. Leave a network empty and its icon is not rendered at all, rather than rendered dead.",
      fields: [
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "twitter", title: "Twitter URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
      ],
    }),
    injectLanguage(),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Site Settings",
        subtitle: languageName(language),
        media: ControlsIcon,
      };
    },
  },
});
