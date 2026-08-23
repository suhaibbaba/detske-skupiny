import { defineType, defineField } from "sanity";
import { EllipsisVerticalIcon } from "@sanity/icons";

export default defineType({
  name: "spacer",
  title: "Spacer",
  type: "object",
  icon: EllipsisVerticalIcon,
  fields: [
    defineField({
      name: "preset",
      title: "Preset",
      type: "string",
      initialValue: "lg",
      options: {
        layout: "radio",
        list: [
          { title: "XS (16px)", value: "xs" },
          { title: "SM (32px)", value: "sm" },
          { title: "MD (48px)", value: "md" },
          { title: "LG (80px)", value: "lg" },
          { title: "XL (120px)", value: "xl" },
          { title: "Custom", value: "custom" },
        ],
      },
    }),
    defineField({
      name: "custom",
      title: "Custom height (px)",
      type: "number",
      hidden: ({ parent }) => parent?.preset !== "custom",
      validation: (r) => r.min(0).max(600),
    }),
    // Optional responsive overrides
    defineField({
      name: "mobile",
      title: "Mobile height (px)",
      type: "number",
      description: "Overrides height on small screens",
      validation: (r) => r.min(0).max(600),
    }),
    defineField({
      name: "note",
      title: "Note (optional)",
      type: "string",
      description: "Visible only in Studio to explain why this spacer exists",
    }),
  ],
  preview: {
    select: {
      preset: "preset",
      custom: "custom",
      mobile: "mobile",
      note: "note",
    },
    prepare: ({ preset, custom, mobile, note }) => {
      const presetMap: Record<string, number> = {
        xs: 16,
        sm: 32,
        md: 48,
        lg: 80,
        xl: 120,
      };
      const h = preset === "custom" ? custom || 0 : presetMap[preset] || 0;
      const subtitle = `Height: ${h}px${mobile ? ` (mobile: ${mobile}px)` : ""}`;
      return {
        title: "Spacer",
        subtitle: note ? `${subtitle} – ${note}` : subtitle,
        media: EllipsisVerticalIcon,
      };
    },
  },
});
