import { getLocalizedRoutes } from "@/routes";
import type { LocalizedPaths } from "@/lib/seo/metadata";
import { SUPPORTED_LOCALES } from "@/lib/seo/site";
import type { TranslationPath } from "@/lib/sanity/seo";

/**
 * The routes that exist without a document behind them.
 *
 * The catalog is deliberately absent: its top level is a country document, so
 * it comes out of Sanity with the rest of the catalog tree rather than being
 * hard-coded here.
 *
 * Each entry resolves its own path per locale through `getLocalizedRoutes`,
 * which is the single place that knows `/articles` is `/clanky` in Czech - so
 * a renamed segment moves the sitemap and the hreflang links with it.
 */
export const STATIC_ROUTES = [
  { key: "home", path: (locale: string) => getLocalizedRoutes(locale).home },
  {
    key: "groups",
    path: (locale: string) => getLocalizedRoutes(locale).groups,
  },
  {
    key: "articles",
    path: (locale: string) => getLocalizedRoutes(locale).article(),
  },
  {
    key: "cooperation",
    path: (locale: string) => getLocalizedRoutes(locale).cooperation,
  },
  {
    key: "contactUs",
    path: (locale: string) => getLocalizedRoutes(locale).contactUs,
  },
] as const;

export type StaticRouteKey = (typeof STATIC_ROUTES)[number]["key"];

/**
 * A static route's path in every locale.
 *
 * Static routes exist in both locales by definition - there is no document
 * that might only have been translated one way - so these always produce a
 * complete pair, unlike the document helpers in the sitemap.
 */
export function staticRoutePaths(key: StaticRouteKey): LocalizedPaths {
  const route = STATIC_ROUTES.find((candidate) => candidate.key === key);
  if (!route) return {};

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, route.path(locale)]),
  );
}

/**
 * The paths a Sanity document has in each locale.
 *
 * Seeded with the document's own path so a page always lists itself, then
 * filled in from its `translation.metadata` entries. A document with no
 * counterpart ends up with a single entry, which is the point: emitting an
 * `en` alternate that does not exist would send a crawler to a 404, and
 * hreflang links are supposed to be reciprocal.
 *
 * `toRoute` turns a raw path - a slug, or a composed catalog chain - into the
 * localized route for a given locale, which is what differs between a school,
 * an article and a catalog level.
 */
export function documentPaths(
  locale: string,
  ownPath: string | null | undefined,
  translations: TranslationPath[] | null | undefined,
  toRoute: (locale: string, path: string | null | undefined) => string,
): LocalizedPaths {
  const paths: LocalizedPaths = { [locale]: toRoute(locale, ownPath) };

  for (const translation of translations ?? []) {
    if (!translation?.path) continue;
    if (!SUPPORTED_LOCALES.includes(translation.locale)) continue;
    paths[translation.locale] = toRoute(translation.locale, translation.path);
  }

  return paths;
}
