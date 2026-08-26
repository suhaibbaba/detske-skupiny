import type { Template } from "sanity";
import { BASE_LANGUAGE } from "@/structure/language";

/**
 * What a new document starts out as.
 *
 * Two things these settle, both of which would otherwise land on the editor.
 *
 * The first is `language`. It is a hidden, read-only field: the
 * internationalization plugin writes it when a *translation* is created, but
 * nothing writes it for the original. Without a template, every school and
 * every post created through the studio would begin life with no language at
 * all - which is the difference between a new school appearing in the Schools
 * list and appearing nowhere in particular.
 *
 * The second is the drill-down. Geography is browsed country -> region -> area
 * -> subarea (structure/sections/geographySection.ts), and creating a region
 * from inside a country has to produce a region *in that country* - otherwise
 * the new document lands outside the list it was created from and the editor
 * has to go find it. The parameterised templates carry the parent reference
 * down; the structure passes the id it already has.
 *
 * Templates with `parameters` are excluded from any UI that cannot supply them,
 * so the four geography templates never appear in the global "New document"
 * menu - only on the list that knows the parent.
 */

/** Ids used by both the structure lists and `newDocumentOptions`. */
export const BASE_LANGUAGE_TEMPLATES = {
  schools: "schools-base-language",
  blogs: "blogs-base-language",
} as const;

export const GEOGRAPHY_TEMPLATES = {
  regions: "regions-in-country",
  areas: "areas-in-region",
  subareas: "subareas-in-area",
} as const;

/** The plain per-type templates these replace, hidden from the new-doc menu. */
export const REPLACED_DEFAULT_TEMPLATES = ["schools", "blogs"];

type ParentParams = { parentId: string };

/**
 * A geography document that knows its parent.
 *
 * `parentId` is the published id of the document whose list the editor pressed
 * "new" from, which the structure has in hand from the child resolver.
 */
const childOf = (
  id: string,
  title: string,
  schemaType: string,
  referenceField: string,
): Template<ParentParams> => ({
  id,
  title,
  schemaType,
  parameters: [{ name: "parentId", type: "string" }],
  // Annotated rather than inferred: `Template`'s `Value` defaults to `any`, so
  // the union `Value | InitialValueResolver<Params, Value>` collapses and the
  // resolver's parameter comes through untyped.
  value: ({ parentId }: ParentParams) => ({
    language: BASE_LANGUAGE,
    [referenceField]: { _type: "reference", _ref: parentId },
  }),
});

export const initialValueTemplates: Template[] = [
  {
    id: BASE_LANGUAGE_TEMPLATES.schools,
    title: "School",
    schemaType: "schools",
    value: { language: BASE_LANGUAGE },
  },
  {
    id: BASE_LANGUAGE_TEMPLATES.blogs,
    title: "Blog post",
    schemaType: "blogs",
    /**
     * A function, not an object: `publishedAt` has to be the moment the editor
     * pressed "new", and a static value would freeze whenever the studio bundle
     * was built. It is still only a default - the field is editable, and
     * back-dating a post is a normal thing to do.
     */
    value: () => ({
      language: BASE_LANGUAGE,
      publishedAt: new Date().toISOString(),
    }),
  },
  childOf(GEOGRAPHY_TEMPLATES.regions, "Region", "regions", "country"),
  childOf(GEOGRAPHY_TEMPLATES.areas, "Area", "areas", "region"),
  childOf(GEOGRAPHY_TEMPLATES.subareas, "Subarea", "subareas", "area"),
];
