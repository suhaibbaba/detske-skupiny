import type { PostalAddress } from "@/sanity/types";

/**
 * The structured data the site publishes, as plain objects.
 *
 * Kept away from the components that render them so the shapes can be unit
 * tested: a typo in a schema.org property name is invisible in the page and
 * invisible in the JSON, and only shows up as a rich result that never
 * appears.
 *
 * Every builder goes through {@link compact}. Schema.org treats a property
 * present with an empty value as an assertion that the value is empty, so a
 * school with no phone number must have no `telephone` key at all rather than
 * `"telephone": ""` - which is why none of the builders below use `??  ""`.
 */

type JsonLdValue =
  string | number | boolean | null | undefined | JsonLdObject | JsonLdValue[];

export type JsonLdObject = { [key: string]: JsonLdValue };

const isEmpty = (value: JsonLdValue): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") {
    // An object left with nothing but its `@type` is empty in the only sense
    // that matters here: a `PostalAddress` with no street, city or postcode
    // asserts that a school has an address and then declines to say what it
    // is. The keyword itself is not content.
    return Object.keys(value).every((key) => key.startsWith("@"));
  }
  return false;
};

/**
 * Drops every empty property, depth first, so a nested object that ends up
 * with nothing in it disappears along with its key.
 */
export function compact(input: JsonLdObject): JsonLdObject {
  const output: JsonLdObject = {};

  for (const [key, value] of Object.entries(input)) {
    const cleaned =
      value && typeof value === "object" && !Array.isArray(value)
        ? compact(value as JsonLdObject)
        : Array.isArray(value)
          ? value
              .map((item) =>
                item && typeof item === "object" && !Array.isArray(item)
                  ? compact(item as JsonLdObject)
                  : item,
              )
              .filter((item) => !isEmpty(item))
          : value;

    if (!isEmpty(cleaned)) output[key] = cleaned;
  }

  return output;
}

/** The site itself, as the author and publisher of its own content. */
export const organization = (name: string, url: string): JsonLdObject =>
  compact({ "@type": "Organization", name, url });

export type SchoolJsonLdInput = {
  name: string;
  url: string;
  description?: string;
  image?: string;
  address?: PostalAddress | null;
  /** The region the school sits in, used as `addressRegion`. */
  regionName?: string;
  telephone?: string;
  email?: string;
  /** The school's own website, if it has one. */
  sameAs?: string;
};

/**
 * A school, as a `ChildCare` business.
 *
 * `ChildCare` is schema.org's type for exactly this - a facility providing
 * care for children - and it inherits from `LocalBusiness`, which is what
 * carries `address`, `geo` and `telephone`.
 *
 * `geo` comes from the geopoint the studio's map input writes into
 * `address.mapLocation`; the same coordinate the detail page's map pin uses,
 * so the two can never disagree.
 */
export function schoolJsonLd({
  name,
  url,
  description,
  image,
  address,
  regionName,
  telephone,
  email,
  sameAs,
}: SchoolJsonLdInput): JsonLdObject {
  const location = address?.mapLocation;

  return compact({
    "@context": "https://schema.org",
    "@type": "ChildCare",
    name,
    url,
    description,
    image,
    telephone,
    email,
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: address?.street,
      addressLocality: address?.city,
      postalCode: address?.postalCode,
      addressRegion: regionName,
    },
    geo:
      typeof location?.lat === "number" && typeof location?.lng === "number"
        ? {
            "@type": "GeoCoordinates",
            latitude: location.lat,
            longitude: location.lng,
          }
        : undefined,
  });
}

export type ArticleJsonLdInput = {
  headline: string;
  url: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  siteName: string;
  siteUrl: string;
};

/**
 * A blog post.
 *
 * The author is the site rather than the person named on the article: the
 * `authors` documents carry a name and a bio but no URL of their own, and an
 * `@type: Person` with nothing but a name says less than naming the
 * organisation that actually publishes them.
 */
export function articleJsonLd({
  headline,
  url,
  description,
  image,
  datePublished,
  dateModified,
  siteName,
  siteUrl,
}: ArticleJsonLdInput): JsonLdObject {
  const publisher = organization(siteName, siteUrl);

  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    url,
    mainEntityOfPage: url,
    description,
    image,
    datePublished,
    dateModified,
    author: publisher,
    publisher,
  });
}

export type BreadcrumbEntry = { name: string; url: string };

/**
 * The visible breadcrumb trail, restated for a crawler.
 *
 * Built from the same array the `<Breadcrumbs>` component renders, so the two
 * cannot drift - Google treats a `BreadcrumbList` that disagrees with the page
 * as a reason to ignore it.
 */
export function breadcrumbJsonLd(
  items: BreadcrumbEntry[],
): JsonLdObject | null {
  const entries = items.filter((item) => item.name && item.url);
  // A single crumb is just the page itself; there is no trail to describe.
  if (entries.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export type WebSiteJsonLdInput = {
  name: string;
  url: string;
  description?: string;
  /**
   * The catalog URL the site's search box submits to, with the query still to
   * be substituted - omitted when the dataset has no country to search within.
   */
  searchUrl?: string;
};

/**
 * The site, with its search endpoint.
 *
 * The `SearchAction` is only emitted when `searchUrl` is given. The catalog's
 * search is a real, stable GET: the term lives in the query string under
 * `name` (see the nuqs parsers in the catalog's searchParams.ts), a bare
 * `?name=` renders the unfiltered list, and the server reads it directly. What
 * is not fixed is which country page it applies to, which is why the caller
 * resolves that from the dataset and passes nothing if there is none.
 */
export function webSiteJsonLd({
  name,
  url,
  description,
  searchUrl,
}: WebSiteJsonLdInput): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: searchUrl
      ? {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${searchUrl}?name={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        }
      : undefined,
  });
}
