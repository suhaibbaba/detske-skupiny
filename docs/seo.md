# SEO

How the site describes itself to search engines, and where each piece lives.

## Two locales, two hosts

Everything here follows from one fact: next-intl routes by **domain**, not by
path prefix (`localePrefix: "never"` in `src/i18n/routing.ts`). The Czech site
is `detskeskupinky.cz`, the English one `en.detskeskupinky.cz`, and they are one
deployment. There is no `/cs` or `/en` segment anywhere, so nothing can infer a
locale from a URL path alone.

That makes every URL the SEO layer emits **absolute**, and it makes the locale
of a request something you either receive as a param (pages) or read from the
`Host` header (`sitemap.ts`, `robots.ts`).

`src/lib/seo/site.ts` is the only module that knows about origins. It derives
them from `routing.domains` rather than the environment variables directly, so
the `:3000` suffix dev mode appends is picked up too and a local run emits
canonicals that actually resolve.

There is deliberately **no `metadataBase`**. It would have to be a `URL`, and
`generateMetadata` is cached on every route, so its return value must survive
serialisation - a `URL` does not. Nothing needs it: every URL is already
absolute.

## Sitemap

`app/sitemap.ts` serves one sitemap **per host**. A request to
`detskeskupinky.cz/sitemap.xml` lists Czech URLs with English alternates;
`en.detskeskupinky.cz/sitemap.xml` is the mirror image. The Host header is what
distinguishes them - the file sits outside `app/[locale]`, is skipped by the
next-intl proxy (its matcher excludes paths containing a dot), and receives no
params.

The alternative — one sitemap listing both hosts — is legal only when both hosts
are verified as one property, and it means each domain publishes a document
mostly about the other one.

What it lists, all from Sanity through `sanityFetch` under the usual tags:

| type | source | notes |
| --- | --- | --- |
| static routes | `src/lib/seo/routes.ts` | translated per locale via `getLocalizedRoutes` |
| catalog levels | `countries`, `regions`, `areas`, `subareas` | **only where `schoolCount > 0`** |
| school pages | `schools` | published only |
| articles | `blogs` | |

`lastModified` is the document's own `_updatedAt`. The index routes have no
document of their own, so they take the newest `_updatedAt` of what they list -
never `new Date()`, which tells a crawler the whole site changed on every fetch.

## Cross-locale linking

`@sanity/document-internationalization` does not store a pointer on the
documents themselves. It keeps a separate `translation.metadata` document whose
`translations` array holds one reference per language, keyed by the language id.
The only route from a document to its counterpart is to find the metadata
document that references it - `translationPaths` in
`src/lib/sanity/fragments.ts` does exactly that, and takes the path expression
to evaluate against the referenced document (a slug for a school, a whole
composed chain for an area).

A document with no counterpart gets **no** alternate for the other locale,
rather than a link to a URL that does not exist. `x-default` is the Czech URL.

## Canonicals

Every page emits an absolute, self-referencing canonical. Two rules matter:

- **The catalog ignores its query string.** Filters, search and paging are query
  state over the same set of schools, so `/katalog/praha`,
  `/katalog/praha?categories=x` and `/katalog/praha?page=3` all name
  `/katalog/praha` as their canonical. Without this the catalog would be indexed
  as an unbounded number of near-duplicates.
- **The articles index does the same** with `?category=`.

## Structured data

`src/lib/seo/jsonLd.ts` builds the objects; `src/components/seo/JsonLd.tsx`
renders them. Every builder runs through `compact()`, which drops empty values -
including an object left with nothing but its `@type`. Schema.org treats a
property present with an empty value as an assertion that the value is empty, so
a school with no phone must have no `telephone` key at all.

| page | type |
| --- | --- |
| school detail | `ChildCare` (address, geo, telephone/email, the school's site as `sameAs`) |
| article | `Article` (site as author and publisher) |
| anything with a breadcrumb | `BreadcrumbList` |
| home | `WebSite` with a `SearchAction` |

The `BreadcrumbList` is emitted from inside `<Breadcrumbs>` so it is built from
the very array being rendered - Google discards a trail that disagrees with the
visible one.

The `SearchAction` points at `/{catalog}/{country}?name={search_term_string}`.
`name` is the catalog's real search parameter (see the nuqs parsers in the
catalog's `searchParams.ts`). Which country is not fixed, so it is resolved from
the dataset; a dataset with no country publishes no action rather than one that
404s.

## Open Graph images

`src/lib/seo/images.ts` crops the document's own image to 1200x630 at the Sanity
CDN. The order is: document image, then the image set in Sanity settings, then
`public/og-default.png`. A page never has no share image.

## Recommended schema additions

None of these are in this PR - the fallbacks below are what the site uses today,
and each of these would replace a fallback with something an editor controls.

1. **`schools.metaDescription`** (text, ~160 chars). The GROQ has projected this
   field since before this PR and the page has always preferred it, but **no
   schema defines it**, so it is always undefined. Today the description falls
   back to `shortSummary`, then to "name, area". Adding the field makes the
   existing preference real. *Highest value of the list - school pages are the
   bulk of the site.*
2. **`schools.seoTitle`** (string). The title is the school's `name`, which is
   fine, but a name like "Sluníčko" carries no location or keyword. An optional
   override would let an editor write "Dětská skupina Sluníčko - Praha 1".
3. **`postalAddress.country`** (string, or a reference to `countries`). There is
   no country field, so the `PostalAddress` in the `ChildCare` JSON-LD has no
   `addressCountry` - the one property Google most wants for a local business.
   Note `fullAddressField` in `lib/sanity/fragments.ts` already reads
   `address.country` and `address.extraDistrict`, neither of which exists;
   worth reconciling with the schema's `extra` field at the same time.
4. **`schools.openGraphImage`** (image). The share card uses the first primary
   image, which is composed for a 1920x1080 hero and loses its subject when
   cropped to 1200x630. An optional dedicated image would fix that; a hotspot on
   `primaryImages` would help too.
5. **`blogs.seoTitle` / `blogs.metaDescription`**. Articles fall back to `title`
   and `excerpt`, which is genuinely reasonable - `excerpt` is already described
   in the schema as being for SEO. Lowest priority.
6. **`countries` / `regions` / `areas` / `subareas`: `metaDescription`**.
   Catalog pages compose their description from a dictionary template plus the
   place name. A per-place override would let editors write something specific
   for the handful of high-traffic regions.
7. **A `noIndex` boolean** on `schools` and `blogs`. There is currently no way
   for an editor to keep a thin or retired page out of the index short of
   unpublishing it.
