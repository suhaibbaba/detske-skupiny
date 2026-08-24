import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

export default defineType({
  name: "contactUsForm",
  type: "object",
  icon: EnvelopeIcon,
  title: "Contact Us Form",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "privacyPolicy",
      title: "Privacy Policy",
      type: "richText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sendMessageCta",
      title: "Send Message CTA",
      type: "cta",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Contact form",
        media: EnvelopeIcon,
        subtitle: "Contact form",
      };
    },
  },
});
