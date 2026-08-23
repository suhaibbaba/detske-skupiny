import { defineType, defineField, defineArrayMember } from "sanity";
import kebabCase from "lodash.kebabcase";
import { appendLanguageSubtitle, injectLanguage, upperCase } from "@/utility";
import {
  ThListIcon,
  InfoOutlineIcon,
  DocumentTextIcon,
  UsersIcon,
  PinIcon,
  TagIcon,
  DocumentsIcon,
  ImageIcon,
} from "@sanity/icons";

export default defineType({
  name: "schools",
  title: "Schools",
  type: "document",
  icon: ThListIcon,
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      icon: InfoOutlineIcon,
      default: true,
    },
    {
      name: "extraInformation",
      title: "Extra Information",
      icon: DocumentTextIcon,
    },
    {
      name: "providerInfo",
      title: "Provider Information",
      icon: UsersIcon,
    },
    {
      name: "location",
      title: "Location & Contact",
      icon: PinIcon,
    },
    {
      name: "classification",
      title: "Categories & Tags & Types",
      icon: TagIcon,
    },
    {
      name: "content",
      title: "Content Sections",
      icon: DocumentsIcon,
    },
    {
      name: "media",
      title: "Images & Gallery",
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: "logo",
      type: "image",
      group: "basic",
      description: "School logo (recommended: square format, min 150x150px)",
    }),
    defineField({
      name: "name",
      type: "string",
      group: "basic",
      description: "Official name of the school",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "nameNormalized",
      type: "string",
      title: "Name (searchable)",
      hidden: true,
      // Auto-generate on save
    }),
    defineField({
      name: "isHighPriority",
      type: "boolean",
      hidden: true,
      // Auto-generate on save
    }),
    defineField({
      name: "shortSummary",
      type: "text",
      rows: 4,
      group: "basic",
      description:
        "Brief overview (50-200 characters) shown in search results and previews",
      validation: (r) => r.min(50).max(200),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basic",
      description: "URL-friendly identifier (auto-generated from name)",
      options: {
        source: "name",
        slugify: (input: string) => kebabCase(input.trim()),
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const language = document?.language;

          if (!document) {
            return true;
          }

          // Use Sanity client to query for same slug in same locale
          const query = `count(*[_type == $type && slug.current == $slug && language == $language])`;
          const params = {
            type: document._type,
            slug,
            language,
          };

          const result = await getClient({
            apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
          }).fetch(query, params);

          return result <= 1; // true = unique, false = duplicate
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "website",
      type: "link",
      group: "basic",
      description: "Official school website",
      options: {
        enableText: true,
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "capacity",
      type: "number",
      group: "basic",
      description: "School capacity (number of children)",
    }),

    // Extra Information
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "array",
      group: "extraInformation",
      description: "Key contact persons (admissions, principal, etc.)",
      of: [{ type: "contactInfo" }],
      validation: (r) =>
        r.max(5).warning("Consider keeping contacts under 5 for better UX"),
    }),
    defineField({
      name: "transportation",
      title: "Transportation Nearby",
      type: "array",
      group: "extraInformation",
      description:
        "Nearby public transportation (bus stops, metro stations, etc.)",
      of: [{ type: "transportItem" }],
      validation: (r) =>
        r.max(8).warning("Consider listing only the closest transport options"),
    }),
    defineField({
      name: "links",
      type: "array",
      group: "extraInformation",
      description: "Additional links (social media, enrollment forms, etc.)",
      of: [
        defineArrayMember({
          name: "linkItem",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "link",
              type: "link",
              options: {
                enableText: true,
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
                subtitle: type || "URL",
              };
            },
          },
        }),
      ],
    }),

    // Provider Information
    defineField({
      name: "cin",
      title: "CIN",
      type: "string",
      group: "providerInfo",
      description: "Company Identification Number (IČO) of the provider",
      validation: (r) => r.regex(/^\d{8}$/).warning("CIN should be 8 digits"),
    }),
    defineField({
      name: "providerName",
      title: "Provider Name",
      type: "string",
      group: "providerInfo",
      description: "Official name of the service provider/organization",
    }),

    // Location & Contact
    defineField({
      name: "area",
      title: "Area",
      type: "reference",
      group: "location",
      description: "Main area/district where the school is located",
      to: [{ type: "areas" }],
    }),
    defineField({
      name: "subarea",
      title: "Subarea",
      type: "reference",
      group: "location",
      description: "Optional: More specific neighborhood or subarea",
      to: [{ type: "subareas" }],
      hidden: ({ document }) => !document?.area,
      options: {
        filter: ({ document }) => {
          if (!(document?.area as any)?._ref) return { filter: "false" };
          return {
            filter: "area._ref == $areaId",
            params: { areaId: (document.area as any)._ref },
          };
        },
      },
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "postalAddress",
      group: "location",
      description: "Full postal address of the school",
    }),

    // Categories & Tags
    defineField({
      name: "categories",
      title: "School Category",
      type: "array",
      group: "classification",
      description:
        "Primary school type (e.g., Primary, Secondary, International)",
      of: [{ type: "reference", to: [{ type: "schoolCategories" }] }],
      validation: (Rule) =>
        Rule.min(1)
          .required()
          .error("At least one category is required")
          .custom((types) => {
            if (!types) return true;

            const ids = types.map((ref: any) => ref._ref);
            const uniqueIds = new Set(ids);

            if (ids.length !== uniqueIds.size) {
              return "Each school category can only be selected once";
            }

            return true;
          }),
    }),
    defineField({
      name: "tags",
      title: "School Tags",
      type: "array",
      group: "classification",
      of: [{ type: "reference", to: [{ type: "schoolTags" }] }],
      validation: (Rule) =>
        Rule.custom((types) => {
          if (!types) return true;

          const ids = types.map((ref: any) => ref._ref);
          const uniqueIds = new Set(ids);

          if (ids.length !== uniqueIds.size) {
            return "Each school tag can only be selected once";
          }

          return true;
        }),
    }),
    defineField({
      name: "types",
      title: "School Types",
      type: "array",
      group: "classification",
      of: [{ type: "reference", to: [{ type: "schoolTypes" }] }],
      validation: (Rule) =>
        Rule.custom((types) => {
          if (!types) return true;

          const ids = types.map((ref: any) => ref._ref);
          const uniqueIds = new Set(ids);

          if (ids.length !== uniqueIds.size) {
            return "Each school type can only be selected once";
          }

          return true;
        }),
    }),

    // Content
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      group: "content",
      description:
        "Detailed information about the school, history, mission, and values",
    }),

    // Media
    defineField({
      name: "primaryImages",
      title: "Primary Images",
      type: "array",
      group: "media",
      description:
        "Main showcase images (1-3 images, recommended: 1920x1080px, landscape)",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (r) =>
        r
          .min(1)
          .error("At least one primary image is required")
          .max(3)
          .warning("Maximum 3 primary images for optimal performance"),
    }),

    // Hidden Information
    defineField({
      name: "countrySlug",
      type: "string",
      title: "Country Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region->country",
    }),
    defineField({
      name: "regionSlug",
      type: "string",
      title: "Region Slug (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated from area->region",
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      title: "Sort Order (Auto)",
      readOnly: true,
      hidden: true,
      description: "Auto-populated and Re-generate by schedule plugin",
    }),
    injectLanguage(),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "area.name",
      media: "logo",
      language: "language",
    },
    prepare({ title, subtitle, media, language }) {
      return {
        title: title || "Untitled School",
        subtitle: appendLanguageSubtitle(
          language,
          subtitle ? `📍 ${subtitle} Area` : `No area selected`,
        ),
        media: media,
      };
    },
  },
});
