import { defineType, defineField } from "sanity";
import { phoneValidator } from "@/utility";

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
  preview: { select: { title: "name", subtitle: "role" } },
});
