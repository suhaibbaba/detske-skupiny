import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

export default defineType({
  name: "pricingSection",
  title: "Pricing Section",
  type: "object",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Section Subtitle",
      type: "string",
    }),
    defineField({
      name: "mostPopularImage",
      title: "Most Popular Image",
      type: "image",
    }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "plan",
          title: "Plan",
          fields: [
            defineField({ name: "name", title: "Plan Name", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                    }),
                    defineField({
                      name: "included",
                      title: "Included?",
                      type: "boolean",
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: { title: "label", included: "included" },
                    prepare: ({ title, included }) => ({
                      title,
                      subtitle: included ? "✅ Included" : "❌ Not included",
                    }),
                  },
                }),
              ],
            }),
            defineField({
              name: "isMostPopular",
              title: "Most Popular?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "cta",
              title: "Call to Action",
              type: "cta",
            }),
          ],
        }),
      ],
    }),
  ],
});
