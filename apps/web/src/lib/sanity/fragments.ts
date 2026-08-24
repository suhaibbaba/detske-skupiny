import { groq } from "next-sanity";

/**
 * Shared GROQ projections.
 *
 * These are the projections that used to be copy-pasted across
 * src/sanity/queries/*. Keeping one copy matters most for `linkFields`: link
 * resolution now happens inside GROQ, so any place that returns a `link`
 * object has to project it through this fragment or the link will arrive at
 * the browser as an unresolved reference.
 */

/** `"alias": field.asset->url` - the shape every image projection used. */
export const imageUrl = (field: string, alias = field) =>
  groq`"${alias}": ${field}.asset->url`;

/**
 * A `link` object with its `internalLink` reference already dereferenced.
 *
 * This replaces src/sanity/utilites/expandLinks.ts, which walked every fetched
 * payload, collected `link.internalLink` refs and resolved them in a second
 * round-trip. The projection below is a faithful port of the query that helper
 * ran, so the shape `parseLinkField` receives is unchanged: `_type` picks the
 * route, `slug` is a plain string, and `text`/`title` supply the label.
 *
 * The geo types keep their own overrides because their usable path is
 * `fullSlug` (or `slug.current` for a country), not the bare `slug`.
 */
export const internalLinkFields = groq`
  _id,
  _type,
  "slug": select(defined(slug.current) => slug.current, slug),
  title,
  name,
  _type == "countries" => {
    "text": name,
    "slug": slug.current,
  },
  _type == "regions" => {
    "text": name,
    "slug": fullSlug,
  },
  _type == "areas" => {
    "text": name,
    "slug": fullSlug,
  },
  _type == "subareas" => {
    "text": name,
    "slug": fullSlug,
  }
`;

export const linkFields = groq`
  ...,
  internalLink->{ ${internalLinkFields} }
`;

/** A `link` field, resolved. */
export const linkField = groq`link{ ${linkFields} }`;

/** A `cta` object: everything it has, with its link resolved. */
export const ctaFields = groq`
  ...,
  ${linkField}
`;

/** The `pageHero` object shared by blogPage, schoolPage, group and contactUs. */
export const pageHeroFields = groq`
  ...,
  ctas[]{ ${ctaFields} }
`;

/** Title and description fields used to build route metadata. */
export const metaFields = groq`
  title,
  metaDescription
`;

/**
 * The single-line address the map popups and school cards render.
 *
 * Was duplicated verbatim in page.ts (mapCollection markers) and
 * school-list.ts (catalog markers).
 */
export const fullAddressField = groq`
  "fullAddress":
    select(defined(address.street) => address.street, "") +
    select(defined(address.extraDistrict) => ", " + address.extraDistrict, "") +
    select(defined(address.city) => ", " + address.city, "") +
    select(defined(address.postalCode) => ", " + address.postalCode, "") +
    select(defined(address.country) => ", " + address.country, "")
`;

/** A school reduced to what a map marker needs. */
export const markerFields = groq`
  "id": _id,
  "coordinate": address.mapLocation,
  name,
  ${fullAddressField},
  "slug": slug.current
`;

export const tagFields = groq`
  "id": _id,
  name,
  "slug": slug.current,
  "borderColor": borderColor.hex
`;

export const schoolTypeFields = groq`
  "id": _id,
  name,
  highPriority,
  visibility,
  ${imageUrl("icon")},
  "backgroundColor": backgroundColor.hex
`;

export const schoolCategoryFields = groq`
  "id": _id,
  name,
  "slug": slug.current,
  ${imageUrl("emoji")},
  "borderColor": borderColor.hex
`;

/**
 * A school as rendered in a card grid or carousel.
 *
 * The union of the two projections this replaces - the home/cooperation
 * carousels asked for `categories[].emoji`, the catalog grid for
 * `categories[].borderColor` and `types[].visibility`, and only the catalog
 * asked for `logo`. Returning the superset keeps both call sites working off
 * one fragment; no consumer sees a field disappear.
 *
 * `website` is a link field, so it goes through `linkFields` like any other.
 */
export const schoolCardFields = groq`
  "id": _id,
  name,
  "slug": slug.current,
  shortSummary,
  ${imageUrl("logo")},
  website{ ${linkFields} },
  "primaryImage": select(
    defined(primaryImages[0].asset) => primaryImages[0].asset->url,
    null
  ),
  area->{ "id": _id, name, "slug": slug.current },
  "region": area->region->{ "id": _id, name, "slug": slug.current },
  tags[]->{ ${tagFields} },
  types[]->{ ${schoolTypeFields} },
  categories[]->{ ${schoolCategoryFields} }
`;

/**
 * Link-bearing fields inside a page section.
 *
 * Section documents are projected with a bare `...` spread, so without these
 * overrides their CTAs would come back unresolved. Every section type that
 * holds a `cta`/`ctas` is covered:
 *
 *   ctas[]  - hero
 *   cta     - homeBanner, infoBlock, latestSchoolCollection,
 *             listOfSchoolSection, sectionPortalsOffered
 *   plans[] - pricingSection
 *
 * Add to this list when a new section type gains a CTA (see
 * apps/studio/schemaTypes/components).
 */
export const sectionLinkFields = groq`
  ctas[]{ ${ctaFields} },
  cta{ ${ctaFields} },
  plans[]{
    ...,
    cta{ ${ctaFields} }
  }
`;
