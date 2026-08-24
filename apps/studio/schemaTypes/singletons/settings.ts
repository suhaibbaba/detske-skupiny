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
    }),
    defineField({
      name: "defaultImage",
      type: "image",
    }),
    defineField({
      name: "supportEmail",
      title: "Support Email",
      type: "string",
    }),
    defineField({
      name: "officePhoneNumber",
      title: "Office Phone Number",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media",
      type: "object",
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
