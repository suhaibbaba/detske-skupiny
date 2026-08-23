import { defineType, defineField } from "sanity";

export default defineType({
  name: "socialLinks",
  title: "Website & Social Media",
  type: "object",
  fields: [
    defineField({ name: "website", type: "url" }),
    defineField({ name: "facebook", type: "url" }),
    defineField({ name: "instagram", type: "url" }),
    defineField({ name: "youtube", type: "url" }),
    defineField({ name: "x", title: "X (Twitter)", type: "url" }),
  ],
});
