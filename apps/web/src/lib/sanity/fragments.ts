import { groq } from "next-sanity";
import { excludeDraft, languageQuery } from "@/sanity/queries/filters";

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
 * The catalog path of a geography document, composed from its reference chain.
 *
 * These replace the `fullSlug` field the studio used to denormalise onto every
 * region, area and subarea. Nothing writes that field any more, so the path is
 * built here from the references that define it - which also means a renamed
 * country slug is reflected everywhere on the next publish instead of needing
 * every descendant document rewritten.
 *
 * The leading slash is part of the value, exactly as `fullSlug` stored it:
 * `getSelectedSlug` in the catalog produces the same shape, and the two are
 * compared to decide which filter is active. Countries are the exception and
 * stay a bare `slug.current`, as they always were.
 *
 * Each fragment is written for a projection of that document type - use
 * `regionPath` inside `*[_type == "regions"]{...}`, and so on.
 */
export const regionPath = groq`"/" + country->slug.current + "/" + slug.current`;

export const areaPath = groq`"/"
  + region->country->slug.current + "/"
  + region->slug.current + "/"
  + slug.current`;

export const subareaPath = groq`"/"
  + area->region->country->slug.current + "/"
  + area->region->slug.current + "/"
  + area->slug.current + "/"
  + slug.current`;

/**
 * How many schools sit inside the geography document being projected.
 *
 * These replace the `schoolCount` field a scheduled script used to write onto
 * every country, region, area and subarea - a number that was wrong from the
 * moment a school was published until the next run. The filters are ported
 * from that script unchanged, so the values are the ones the site always meant
 * to show; they are just computed at read time now.
 *
 * `^` is the document being projected, so each of these belongs directly in a
 * projection of its own type.
 */
export const schoolCountForCountry = groq`count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region->country->slug.current == ^.slug.current
])`;

export const schoolCountForRegion = groq`count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region._ref == ^._id
])`;

export const schoolCountForArea = groq`count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area._ref == ^._id
])`;

export const schoolCountForSubarea = groq`count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  subarea._ref == ^._id
])`;

/**
 * A `link` object with its `internalLink` reference already dereferenced.
 *
 * This replaces src/sanity/utilites/expandLinks.ts, which walked every fetched
 * payload, collected `link.internalLink` refs and resolved them in a second
 * round-trip. The projection below is a faithful port of the query that helper
 * ran, so the shape `parseLinkField` receives is unchanged: `_type` picks the
 * route, `slug` is a plain string, and `text`/`title` supply the label.
 *
 * The geo types keep their own overrides because their usable path is the full
 * `/country/region/area` chain (or `slug.current` for a country), not the bare
 * `slug` - see `regionPath` and friends below.
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
    "slug": ${regionPath},
  },
  _type == "areas" => {
    "text": name,
    "slug": ${areaPath},
  },
  _type == "subareas" => {
    "text": name,
    "slug": ${subareaPath},
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
