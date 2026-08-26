import { defineType, defineField, defineArrayMember } from "sanity";
import kebabCase from "lodash.kebabcase";
import { localizedSubtitle, injectLanguage, upperCase } from "@/utility";
import { ThListIcon } from "@sanity/icons/ThList";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { UsersIcon } from "@sanity/icons/Users";
import { PinIcon } from "@sanity/icons/Pin";
import { TagIcon } from "@sanity/icons/Tag";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { ImageIcon } from "@sanity/icons/Image";

export default defineType({
  name: "schools",
  title: "Schools",
  type: "document",
  icon: ThListIcon,
  /**
   * The tabs, in the order a school is actually filled in.
   *
   * What it is called, where it is, what kind it is, what it says, what it
   * looks like - then the extras, then the paperwork. An editor working left
   * to right reaches the two tabs that decide whether the school appears in
   * the catalog before any administrative detail. The field
   * declarations below are in the same order, because the "All fields" tab
   * renders them in declaration order and a form that disagrees with its own
   * tabs is worse than either order alone.
   */
  groups: [
    {
      name: "basic",
      title: "Basic Information",
      icon: InfoOutlineIcon,
      default: true,
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
  ],
  fields: [
    // Basic Information: what the school is called and how it is summarised.

    defineField({
      name: "name",
      type: "string",
      group: "basic",
      description:
        "The school's official name, as it appears on its own materials. This is the heading on its page, the label on every card in the catalog, and what visitors search for.",
      validation: (r) =>
        r.required().error("A school cannot be published without its name."),
    }),

    defineField({
      name: "shortSummary",
      type: "text",
      rows: 4,
      group: "basic",
      description:
        "One or two sentences about what makes this school itself. It is the text on the catalog card and the description search engines show, so it is read far more often than the page it belongs to.",
      validation: (r) =>
        r
          .min(50)
          .warning(
            "Under 50 characters rarely says anything useful - the card will look unfinished beside its neighbours.",
          )
          .max(200)
          .error(
            "The catalog card clamps this to four lines and search results cut it around 160 characters, so anything past 200 is written for nobody.",
          ),
    }),

    defineField({
      name: "slug",
      type: "slug",
      group: "basic",
      description:
        "The school's address on the site, generated from its name. Changing it after publishing breaks every link that already points here, so change it only if the name itself was wrong.",
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

          // Pinned, not read from the environment. An unset
          // SANITY_STUDIO_API_VERSION falls back to an empty string, which is
          // not a valid API version - the client rejects it, so the uniqueness
          // check throws instead of answering and the editor sees a validation
          // error on a perfectly good slug. The query is a `count()` whose
          // behaviour does not vary by API version, so nothing about it is
          // deployment-specific.
          const result = await getClient({
            apiVersion: "2026-01-01",
          }).fetch(query, params);

          return result <= 1; // true = unique, false = duplicate
        },
      },
      validation: (r) =>
        r
          .required()
          .error(
            "Without a slug this school has no address on the site and nothing can link to it. Press Generate to take one from the name.",
          ),
    }),

    defineField({
      name: "logo",
      type: "image",
      group: "basic",
      description:
        "Shown beside the school's name on its card and page. Square, at least 150x150px; a wide logo will be cropped to fit.",
    }),

    defineField({
      name: "website",
      type: "link",
      group: "basic",
      description:
        "The school's own site, linked from its page. Leave empty if it has none - an empty link renders as a dead button.",
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
      description:
        "How many children the group is registered for, shown on the school's page. Leave it empty rather than guessing.",
    }),

    // Location: where it is, and therefore which catalog pages list it.

    defineField({
      name: "area",
      title: "Area",
      type: "reference",
      group: "location",
      description:
        "The district this school belongs to. It is what puts the school on a catalog page and on the map - a school with no area is published but cannot be found by browsing.",
      to: [{ type: "areas" }],
    }),

    defineField({
      name: "subarea",
      title: "Subarea",
      type: "reference",
      group: "location",
      description:
        "A neighbourhood within the area, when the area alone is too coarse. Optional, and only offered once an area is chosen.",
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
      description:
        "Street and postal code are what the map pin is geocoded from on publish. An address the geocoder cannot resolve still publishes, but the school will be missing from every map on the site.",
    }),

    // Classification: the vocabularies the catalog filters by.

    defineField({
      name: "categories",
      title: "School Category",
      type: "array",
      group: "classification",
      description:
        "What kind of school this is. The catalog's main filter reads it, so a school's categories decide which searches can find it at all.",
      of: [{ type: "reference", to: [{ type: "schoolCategories" }] }],
      validation: (Rule) =>
        Rule.min(1)
          .required()
          .error(
            "A school with no category is missing from the catalog's main filter, which is how most visitors arrive.",
          )
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
      description:
        "Optional labels shown on the catalog card and offered as filters - bilingual, forest group, garden. Tags describe features; categories describe what the school is.",
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
      description:
        "The legal form of the establishment. Publishing recomputes this school's priority from these, which is what decides where it sits in an unsorted catalog list.",
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

    // Content: the body of the school's own page.

    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      group: "content",
      description:
        "The body of the school's own page - who runs it, what a day looks like, what makes it different. The short summary is what gets someone here; this is what they read once they arrive.",
    }),

    // Media: the images the catalog card and the page header use.

    defineField({
      name: "primaryImages",
      title: "Primary Images",
      type: "array",
      group: "media",
      description:
        "The photos at the top of the school's page; the first is also its catalog card. Landscape, around 1920x1080. The first one is the largest image on the page and the slowest thing on it to load, so make it a real photograph.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (r) =>
        r
          .min(1)
          .error(
            "A school with no image renders as an empty grey box in the catalog. One photograph is enough.",
          )
          .max(3)
          .warning(
            "Every image past the third is downloaded by every visitor and seen by almost none of them.",
          ),
    }),

    // Extra information: useful to a parent, not needed to publish.

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

    // Provider: who runs the school. Administrative, so last.

    defineField({
      name: "cin",
      title: "CIN",
      type: "string",
      group: "providerInfo",
      description:
        "The provider's IČO, eight digits. Not shown to visitors; it is how a school is matched against the public register.",
      validation: (r) => r.regex(/^\d{8}$/).warning("CIN should be 8 digits"),
    }),

    defineField({
      name: "providerName",
      title: "Provider Name",
      type: "string",
      group: "providerInfo",
      description:
        "The organisation that runs the school, when it differs from the school's own name.",
    }),

    // Written on publish by plugins/computedFields.ts, or by the
    // internationalization plugin. Hidden from the form.

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

    injectLanguage(),
  ],
  /**
   * A row in the catalog list.
   *
   * Two schools with the same name in different towns are common, so the
   * subtitle is where they are: "Praha 6 · Praha", the area followed by the
   * region it sits in. `area.region.name` reaches two references deep, which
   * the preview system resolves by following each reference in turn - and
   * because areas and regions are few and shared, the rows of a long list
   * subscribe to the same handful of documents rather than one each.
   *
   * "No area yet" rather than a blank: a school with no area is missing from
   * every catalog page on the site, and the list is where that should be
   * visible.
   */
  preview: {
    select: {
      title: "name",
      area: "area.name",
      region: "area.region.name",
      media: "logo",
      language: "language",
    },
    prepare({ title, area, region, media, language }) {
      return {
        title: title || "Untitled school",
        subtitle: localizedSubtitle(language, area ?? "No area yet", region),
        media: media || ThListIcon,
      };
    },
  },
});
