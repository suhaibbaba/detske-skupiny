import { excludeDraft, languageQuery } from "@/lib/sanity/filters";

/**
 * Shared GROQ projections.
 *
 * One copy of each projection, shared by every feature's query module. That
 * matters most for `linkFields`: link resolution happens inside GROQ, so any
 * place that returns a `link` object has to project it through this fragment or
 * the link arrives at the browser as an unresolved reference.
 *
 * Nothing here carries the `groq` tag, and that is deliberate. These are
 * fragments - halves of a projection, a bare filter, a count - not queries, and
 * Sanity TypeGen parses every tagged template it finds as a complete GROQ
 * query. Tagged, each one below reports a syntax error on every run and buries
 * the failures that actually matter. Untagged they are still resolved when a
 * query interpolates them, which is the only place they are ever evaluated.
 * The `groq` tag is reserved for `defineQuery` call sites in the query modules.
 */

/**
 * `"field": field.asset->url` - the shape every image projection used.
 *
 * `imageUrl` and `imageUrlAs` are two functions rather than one with a
 * defaulted `alias` because Sanity TypeGen evaluates these fragments
 * statically: it binds a parameter from the call site and gives up on one that
 * exists only as a default ("Could not find binding for node \"alias\""), which
 * silently drops every query the fragment appears in from the generated types.
 */
export const imageUrl = (field: string) => `"${field}": ${field}.asset->url`;

/** `imageUrl` where the projected key differs from the field it reads. */
export const imageUrlAs = (field: string, alias: string) =>
  `"${alias}": ${field}.asset->url`;

/**
 * The same URL, plus the base64 thumbnail Sanity generates for every asset.
 *
 * `next/image` can paint a `blurDataURL` immediately and cross-fade to the
 * real file, which turns the gap before a large image arrives from a blank box
 * into something that looks deliberate. It is only worth the extra field where
 * that gap is actually visible - the LCP image of a route - so this is used by
 * the school detail and article queries rather than by every image projection.
 *
 * Dimensions are deliberately NOT projected here: they are already encoded in
 * the asset id, and `imageDimensions` in lib/sanity/imageUrl.ts
 * reads them from there. Adding them would change the shape every consumer
 * receives for a number the URL already carries.
 */
export const imageUrlWithLqip = (field: string) => `
  "${field}": ${field}.asset->url,
  "${field}Lqip": ${field}.asset->metadata.lqip
`;

/**
 * The catalog path of a geography document, composed from its reference chain.
 *
 * Composed at read time from the references that define it rather than stored
 * on each document, so a renamed country slug is reflected everywhere on the
 * next publish instead of needing every descendant rewritten.
 *
 * The leading slash is part of the value: `getSelectedSlug` in the catalog
 * produces the same shape, and the two are compared to decide which filter is
 * active. Countries are the exception and stay a bare `slug.current`.
 *
 * Each fragment is written for a projection of that document type - use
 * `regionPath` inside `*[_type == "regions"]{...}`, and so on.
 */
export const regionPath = `"/" + country->slug.current + "/" + slug.current`;

export const areaPath = `"/"
  + region->country->slug.current + "/"
  + region->slug.current + "/"
  + slug.current`;

export const subareaPath = `"/"
  + area->region->country->slug.current + "/"
  + area->region->slug.current + "/"
  + area->slug.current + "/"
  + slug.current`;

/**
 * How many schools sit inside the geography document being projected.
 *
 * Counted at read time rather than stored on each country, region, area and
 * subarea, where the number would be wrong from the moment a school is
 * published until something recomputed it.
 *
 * `^` is the document being projected, so each of these belongs directly in a
 * projection of its own type.
 */
export const schoolCountForCountry = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region->country->slug.current == ^.slug.current
])`;

export const schoolCountForRegion = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area->region._ref == ^._id
])`;

export const schoolCountForArea = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  area._ref == ^._id
])`;

export const schoolCountForSubarea = `count(*[
  _type == "schools" &&
  ${excludeDraft} &&
  ${languageQuery} &&
  subarea._ref == ^._id
])`;

/**
 * A `link` object with its `internalLink` reference already dereferenced.
 *
 * Resolved inside the query rather than by a second round-trip that walks the
 * fetched payload collecting `link.internalLink` refs. The shape
 * `parseLinkField` receives: `_type` picks the route, `slug` is a plain string,
 * and `text`/`title` supply the label.
 *
 * The geo types keep their own overrides because their usable path is the full
 * `/country/region/area` chain (or `slug.current` for a country), not the bare
 * `slug` - see `regionPath` and friends below.
 */
export const internalLinkFields = `
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

export const linkFields = `
  ...,
  internalLink->{ ${internalLinkFields} }
`;

/** A `link` field, resolved. */
export const linkField = `link{ ${linkFields} }`;

/** A `cta` object: everything it has, with its link resolved. */
export const ctaFields = `
  ...,
  ${linkField}
`;

/** The `pageHero` object shared by blogPage, schoolPage, group and contactUs. */
export const pageHeroFields = `
  ...,
  ctas[]{ ${ctaFields} }
`;

/**
 * The single-line address the map popups and school cards render.
 *
 * One copy, shared by the mapCollection markers and the catalog markers.
 *
 * The district segment reads `address.extra`, which is what the `postalAddress`
 * schema calls it. A misspelled field name here does not fail - GROQ returns
 * null for it - so the part of an address that says "Praha 6" would simply
 * vanish from every map popup and card.
 */
export const fullAddressField = `
  "fullAddress":
    select(defined(address.street) => address.street, "") +
    select(defined(address.extra) => ", " + address.extra, "") +
    select(defined(address.city) => ", " + address.city, "") +
    select(defined(address.postalCode) => ", " + address.postalCode, "") +
    select(defined(address.country) => ", " + address.country, "")
`;

/** A school reduced to what a map marker needs. */
export const markerFields = `
  "id": _id,
  "coordinate": address.mapLocation,
  name,
  ${fullAddressField},
  "slug": slug.current
`;

export const tagFields = `
  "id": _id,
  name,
  "slug": slug.current,
  "borderColor": borderColor.hex
`;

export const schoolTypeFields = `
  "id": _id,
  name,
  highPriority,
  visibility,
  ${imageUrl("icon")},
  "backgroundColor": backgroundColor.hex
`;

export const schoolCategoryFields = `
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
export const schoolCardFields = `
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
export const sectionLinkFields = `
  ctas[]{ ${ctaFields} },
  cta{ ${ctaFields} },
  plans[]{
    ...,
    cta{ ${ctaFields} }
  }
`;

/**
 * The catalog path of a geography document, chosen by its own `_type`.
 *
 * `regionPath` and friends above are each written for one projection; this is
 * the same composition where the type is not known until the document is read
 * - the translation pairing below projects whatever document the metadata
 * points at, which may be a country, a region, an area or a subarea.
 *
 * Countries get a leading slash here, unlike the bare `slug.current` the
 * per-type fragments return for them, so every value this produces is a
 * path. `getLocalizedRoutes(...).catalogs` strips it again when it joins.
 */
export const catalogPathBySelfType = `select(
  _type == "countries" => "/" + slug.current,
  _type == "regions" => ${regionPath},
  _type == "areas" => ${areaPath},
  _type == "subareas" => ${subareaPath}
)`;

/**
 * The other locale's version of the document being projected.
 *
 * @sanity/document-internationalization does not store a pointer on the
 * documents themselves - it keeps a separate `translation.metadata` document
 * whose `translations` array holds one reference per language, keyed by the
 * language id. So the only way from a document to its counterpart is to find
 * the metadata document that references it and read the array back out. That
 * is what `references(^._id)` does here.
 *
 * `value` is the reference; `pathExpression` is evaluated inside a projection
 * of the document it points at, which is why the caller supplies it - a school
 * needs `slug.current`, a region needs its whole composed chain.
 *
 * The array includes this document's own language too. Callers key by
 * `locale`, so the self-entry is simply the entry for the locale they are
 * already on, and pairing stays correct whichever direction it is read from.
 *
 * `coalesce(language, _key)` is where the language id lives. Under
 * @sanity/document-internationalization v6 the plugin writes each array member
 * as
 *
 *     {[LANGUAGE_FIELD_NAME]: language, _key: randomKey(), _type: ..., value}
 *
 * - the id is in `language` and `_key` is a random string. Projecting `_key`
 * alone gives a `locale` that matches neither "cs" nor "en", which drops the
 * hreflang alternates on every document-backed page. The `_key` fallback covers
 * older plugin versions, which do key by language id.
 */
export const translationPaths = (pathExpression: string) => `"translations": *[
    _type == "translation.metadata" &&
    references(^._id)
  ][0].translations[]{
    "locale": coalesce(language, _key),
    "path": value->{ "resolved": ${pathExpression} }.resolved
  }`;

/** `translationPaths` for any document whose path is just its slug. */
export const translationSlugs = translationPaths(`slug.current`);

/**
 * `translationPaths` for the geography documents behind catalog pages.
 *
 * The argument is wrapped as `` `${catalogPathBySelfType}` `` rather than
 * passed as the identifier. TypeGen resolves call arguments statically and
 * only understands literals - a bare identifier gives "Could not find binding
 * for node", and every query built from the result is quietly dropped from the
 * generated types. The GROQ produced is byte-identical either way.
 */
export const translationCatalogPaths = translationPaths(
  `${catalogPathBySelfType}`,
);
