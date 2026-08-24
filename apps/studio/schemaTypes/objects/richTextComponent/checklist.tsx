import { defineType, defineField, defineArrayMember } from "sanity";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";
import ChecklistPreview from "@/schemaTypes/objects/richTextComponent/checklistPreview";

export default defineType({
  name: "checklist",
  type: "object",
  title: "Checklist",
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          name: "item",
          title: "Item",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
          preview: {
            select: { title: "text" },
            prepare: ({ title }) => ({ title, media: CheckmarkIcon }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: "Checklist",
      subtitle: items?.length ? `${items.length} item(s)` : "No items",
      items,
      media: CheckmarkIcon,
    }),
  },
  components: {
    preview: (props) => <ChecklistPreview {...(props as any)} />,
  },
});
