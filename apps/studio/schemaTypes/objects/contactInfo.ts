import { defineType, defineField } from "sanity";
import { phoneValidator, subtitle } from "@/utility";
import { UserIcon } from "@sanity/icons/User";

export default defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({
      name: "phone",
      type: "string",
      description: "Include country code, e.g. +971 55 123 4567",
      validation: (r) => r.custom(phoneValidator),
    }),
    defineField({
      name: "email",
      type: "email",
      description: "Include a valid email address",
    }),
  ],
  preview: {
    select: { title: "name", role: "role", phone: "phone", email: "email" },
    prepare({ title, role, phone, email }) {
      return {
        title: title || "Unnamed contact",
        // A contact with neither a phone nor an email is a row the site
        // renders as a name and nothing else.
        subtitle: subtitle(role, phone ?? email ?? "No phone or email"),
        media: UserIcon,
      };
    },
  },
});
