import { pathTranslations } from "@/lib/i18n/routing";

/**
 * Where the other language's version of the current page lives.
 *
 * Switching language on this site is a change of domain, not of path prefix -
 * the Czech site is one host and the English site another - so the switcher
 * has to build a whole URL, and the interesting part is which path to put on
 * the end of it.
 *
 * There are three answers, in descending order of how much they know:
 *
 *  1. The page's own `<link rel="alternate" hreflang="...">`. Every page that
 *     has a counterpart emits one (see lib/seo/metadata.ts), and it is the
 *     only source that knows a *content* slug - the Czech and English versions
 *     of a school are two Sanity documents with two unrelated slugs, and
 *     nothing in the URL can be transformed into the other.
 *  2. Translating the path segments. `pathTranslations` maps `clanky` to
 *     `articles`, `kontakt` to `contact-us` and so on, which is exactly right
 *     for the static routes - they always exist in both languages, so they do
 *     not need an alternate to be emitted for them.
 *  3. The home page, which always exists.
 *
 * Split out of the component so the fallback chain can be unit tested - it is
 * the part with the branches.
 */

/** Every locale a segment is known in, as `{ [segment]: { [locale]: seg } }`. */
type SegmentMap = typeof pathTranslations;

/**
 * Rewrites one path's segments from `fromLocale` into `toLocale`.
 *
 * Segment by segment rather than by regex over the whole string:
 * `localizeHref` does the latter and can only translate *out of* English,
 * because it matches on the English spelling. This has to go both ways.
 */
export function translateSegments(
  pathname: string,
  fromLocale: string,
  toLocale: string,
  segments: SegmentMap = pathTranslations,
): string {
  const translated = pathname.split("/").map((segment) => {
    if (!segment) return segment;

    const entry = Object.values(segments).find(
      (locales) => locales[fromLocale] === segment,
    );

    return entry?.[toLocale] ?? segment;
  });

  return translated.join("/");
}

/**
 * True when every segment of `pathname` is one this app knows how to
 * translate.
 *
 * This is what keeps the fallback honest. `/skupiny/lesni-klub-sluncem` has a
 * translatable first segment and an untranslatable second one, and blindly
 * translating the first would produce `/groups/lesni-klub-sluncem` - a URL
 * that looks right and 404s, which is worse than landing on the home page.
 * Only a path made entirely of known segments is safe to rewrite.
 */
export function isFullyTranslatable(
  pathname: string,
  fromLocale: string,
  segments: SegmentMap = pathTranslations,
): boolean {
  return pathname
    .split("/")
    .filter(Boolean)
    .every((segment) =>
      Object.values(segments).some(
        (locales) => locales[fromLocale] === segment,
      ),
    );
}

export type CounterpartInput = {
  /** `href` of `link[rel=alternate][hreflang=<target>]`, if the page has one. */
  declaredAlternate?: string | null;
  /** The path being viewed now, e.g. `/skupiny/nazev`. */
  pathname: string;
  search: string;
  hash: string;
  fromLocale: string;
  toLocale: string;
  /** `https://en.example.com` - protocol, host and port, no trailing slash. */
  targetOrigin: string;
};

/**
 * The URL to send the browser to.
 *
 * `search` and `hash` ride along on the two computed answers but not on a
 * declared alternate: an alternate is a complete, canonical URL for a specific
 * document, and appending this page's query string to it would carry catalog
 * filters onto a school page, or a `?page=3` onto a route with no paging.
 */
export function counterpartUrl({
  declaredAlternate,
  pathname,
  search,
  hash,
  fromLocale,
  toLocale,
  targetOrigin,
}: CounterpartInput): string {
  if (declaredAlternate) return declaredAlternate;

  if (isFullyTranslatable(pathname, fromLocale)) {
    const path = translateSegments(pathname, fromLocale, toLocale);
    return `${targetOrigin}${path}${search}${hash}`;
  }

  return `${targetOrigin}/`;
}
