import type { MetadataRoute } from "next";
import { defaultLocale } from "@/lib/i18n/routing";
import { getLocalizedRoutes } from "@/routes";
import {
  absoluteUrl,
  localeFromRequest,
  SUPPORTED_LOCALES,
} from "@/lib/seo/site";
import {
  documentPaths,
  STATIC_ROUTES,
  staticRoutePaths,
} from "@/lib/seo/routes";
import type { LocalizedPaths } from "@/lib/seo/metadata";
import { fetchSitemapContent, type SitemapEntry } from "@/lib/sanity/seo";

/**
 * The sitemap for whichever of the two sites asked for it.
 *
 * # Why this reads the Host header
 *
 * Next generates one `sitemap.xml` per deployment, and this deployment serves
 * both `detskeskupinky.cz` and `en.detskeskupinky.cz` - next-intl routes by
 * domain with `localePrefix: "never"`, so there is no locale segment in the
 * path and no `[locale]` param reaches this file. It sits at `app/sitemap.ts`,
 * outside `app/[locale]`, and the next-intl proxy skips it entirely: its
 * matcher excludes any path containing a dot, which `/sitemap.xml` does.
 *
 * So the only thing that distinguishes the two requests is the Host header,
 * and reading it is what lets one file answer both hosts correctly. The Czech
 * site's sitemap lists Czech URLs, each linking its English counterpart
 * through `alternates.languages`, and the English site's does the mirror
 * image. That is what search engines expect: a sitemap should list the URLs of
 * the host that serves it, and cross-link the rest.
 *
 * The alternative - one sitemap listing both hosts' URLs - is legal only when
 * both hosts are verified as one property, and it means each domain publishes
 * a document that is mostly about the other one. Emitting per-host is the
 * smaller, more conventional thing.
 *
 * Reading a header makes this route dynamic. That costs nothing here: it is a
 * single XML document rather than a page, and every Sanity read below it is
 * still cached and tag-invalidated, so a request only pays for the XML
 * serialisation unless an editor has published something.
 */

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/**
 * Priorities are ordered the way the site is: the deeper into the catalog, the
 * narrower the audience. Search engines treat these as a hint at best, but the
 * ordering is the honest one and it is what the previous sitemap expressed.
 */
const CATALOG_WEIGHTS: Record<
  string,
  { priority: number; changeFrequency: ChangeFrequency }
> = {
  country: { priority: 0.9, changeFrequency: "weekly" },
  region: { priority: 0.8, changeFrequency: "weekly" },
  area: { priority: 0.7, changeFrequency: "weekly" },
  subarea: { priority: 0.6, changeFrequency: "monthly" },
};

const STATIC_WEIGHTS: Record<
  string,
  { priority: number; changeFrequency: ChangeFrequency }
> = {
  home: { priority: 1, changeFrequency: "weekly" },
  groups: { priority: 0.8, changeFrequency: "weekly" },
  articles: { priority: 0.6, changeFrequency: "weekly" },
  cooperation: { priority: 0.7, changeFrequency: "monthly" },
  contactUs: { priority: 0.4, changeFrequency: "yearly" },
};

/** Turns a set of localized paths into one sitemap row for `locale`. */
function toSitemapEntry(
  locale: string,
  paths: LocalizedPaths,
  options: {
    lastModified?: string;
    priority: number;
    changeFrequency: ChangeFrequency;
  },
): MetadataRoute.Sitemap[number] | null {
  const own = paths[locale];
  if (!own) return null;

  const languages: Record<string, string> = {};
  for (const supported of SUPPORTED_LOCALES) {
    const path = paths[supported];
    if (path) languages[supported] = absoluteUrl(supported, path);
  }
  // Same reasoning as the page metadata: Czech is the default locale and what
  // an unmatched user should be served. See lib/seo/metadata.ts.
  if (paths[defaultLocale]) {
    languages["x-default"] = absoluteUrl(defaultLocale, paths[defaultLocale]!);
  }

  return {
    url: absoluteUrl(locale, own),
    ...(options.lastModified
      ? { lastModified: new Date(options.lastModified) }
      : {}),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: { languages },
  };
}

/**
 * The newest `_updatedAt` in a group of documents.
 *
 * The index routes have no document of their own, so this is what gives them a
 * `lastModified` that means something. A `new Date()` on every row would tell a
 * crawler the whole site changed on every fetch, which is the same as telling
 * it nothing.
 */
function newestUpdate(...groups: SitemapEntry[][]): string | undefined {
  let newest: string | undefined;

  for (const group of groups) {
    for (const entry of group) {
      if (entry.updatedAt && (!newest || entry.updatedAt > newest)) {
        newest = entry.updatedAt;
      }
    }
  }

  return newest;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = await localeFromRequest();
  const { schools, articles, catalog } = await fetchSitemapContent(locale);

  const lastModifiedFor: Partial<Record<string, string | undefined>> = {
    home: newestUpdate(schools, articles, catalog),
    groups: newestUpdate(schools, catalog),
    articles: newestUpdate(articles),
  };

  const staticEntries = STATIC_ROUTES.map((route) =>
    toSitemapEntry(locale, staticRoutePaths(route.key), {
      lastModified: lastModifiedFor[route.key],
      ...STATIC_WEIGHTS[route.key],
    }),
  );

  const catalogEntries = catalog.map((node) =>
    toSitemapEntry(
      locale,
      documentPaths(locale, node.path, node.translations, (target, path) =>
        getLocalizedRoutes(target).catalogs(path),
      ),
      {
        lastModified: node.updatedAt,
        ...(CATALOG_WEIGHTS[node.level] ?? CATALOG_WEIGHTS.subarea),
      },
    ),
  );

  const schoolEntries = schools.map((school) =>
    toSitemapEntry(
      locale,
      documentPaths(locale, school.path, school.translations, (target, path) =>
        getLocalizedRoutes(target).group(path),
      ),
      {
        lastModified: school.updatedAt,
        priority: 0.7,
        changeFrequency: "monthly",
      },
    ),
  );

  const articleEntries = articles.map((article) =>
    toSitemapEntry(
      locale,
      documentPaths(
        locale,
        article.path,
        article.translations,
        (target, path) => getLocalizedRoutes(target).article(path),
      ),
      {
        lastModified: article.updatedAt,
        priority: 0.5,
        changeFrequency: "monthly",
      },
    ),
  );

  return [
    ...staticEntries,
    ...catalogEntries,
    ...schoolEntries,
    ...articleEntries,
  ].filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);
}
