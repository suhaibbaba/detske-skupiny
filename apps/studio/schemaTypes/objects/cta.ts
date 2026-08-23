import { defineField, defineType } from "sanity";
import { preview } from "vite";

export default defineType({
  name: "cta",
  type: "object",
  title: "CTA",
  fields: [
    defineField({
      name: "link",
      type: "link",
      options: {
        enableText: true,
      },
    }),
    defineField({
      name: "variant",
      type: "string",
      title: "Button Style",
      initialValue: "primary",
      options: {
        list: ["primary", "secondary", "ghost"],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      type: "link.type",
      url: "link.url",
      phone: "link.phone",
      email: "link.email",
      text: "link.text",
    },
    prepare({ type, url, phone, email, text }) {
      const main =
        (type === "phone" && phone) ||
        (type === "email" && email) ||
        url ||
        phone ||
        email;

      return {
        title: text || main || "Link",
      };
    },
  },
});
