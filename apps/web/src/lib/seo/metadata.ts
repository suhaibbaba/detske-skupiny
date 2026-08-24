import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/routing";
import { absoluteUrl, SUPPORTED_LOCALES } from "@/lib/seo/site";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  resolveOgImage,
} from "@/lib/seo/images";
import { getSettings } from "@/sanity/queries/settings";
import type { SanityImageField } from "@/sanity/types";

/**
 * One place that turns "what this page is" into a `Metadata` object.
 *
 * Every route ends up needing the same six things - a canonical, the hreflang
 * pair, an Open Graph block, a Twitter card, a site name and an image with a
 * fallback - and getting any of them subtly different per route is how a site
 * ends up with two canonicals for the same document. So the routes describe
 * the page and this composes the tags.
 */

/** A localized pathname per locale. A locale is absent when no translation exists. */
export type LocalizedPaths = Partial<Record<string, string>>;

/** Open Graph wants a full locale identifier, not the bare language tag. */
const OG_LOCALE: Record<string, string> = {
  cs: "cs_CZ",
  en: "en_US",
};

export const ogLocale = (locale: string) => OG_LOCALE[locale] ?? locale;

/**
 * Canonical plus hreflang for one page.
 *
 * The canonical is always absolute and self-referencing - it names this
 * locale's own URL, never the other domain's. `paths` carries only the locales
 * a version actually exists in, so a Czech-only article gets a canonical and a
 * `cs` alternate and no `en` link pointing at a 404.
 *
 * `x-default` is the Czech URL: it is the default locale and the larger of the
 * two audiences, so it is what a search engine should serve to a user whose
 * language it cannot place.
 */
export function alternatesFor(
  locale: string,
  paths: LocalizedPaths,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};

  for (const supported of SUPPORTED_LOCALES) {
    const path = paths[supported];
    if (path) languages[supported] = absoluteUrl(supported, path);
  }

  const fallback = paths[defaultLocale];
  if (fallback) languages["x-default"] = absoluteUrl(defaultLocale, fallback);

  return {
    canonical: absoluteUrl(locale, paths[locale] ?? "/"),
    languages,
  };
}

export type PageSeoInput = {
  locale: string;
  /** The localized pathname per locale; `paths[locale]` is the canonical one. */
  paths: LocalizedPaths;
  title: string;
  description?: string;
  /**
   * Images to try for the share card, best first. Falls through to the site
   * default and then to public/og-default.png, so a page never has none.
   */
  images?: (SanityImageField | null | undefined)[];
  /** "article" on a blog post; "website" everywhere else. */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * The site-wide bits of metadata that come from Sanity rather than the route.
 *
 * `getSettings` is wrapped in React `cache` and its query is in the Data
 * Cache, and `DefaultImageProvider` already reads it while rendering, so
 * calling it from `generateMetadata` costs nothing extra.
 */
export async function siteContext(locale: string) {
  const [settings, translate] = await Promise.all([
    getSettings(),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return {
    siteName: settings?.siteTitle?.trim() || translate("metaTitle"),
    defaultImage: settings?.defaultImage ?? null,
    translate,
  };
}

export async function buildPageMetadata({
  locale,
  paths,
  title,
  description,
  images = [],
  type = "website",
  publishedTime,
  modifiedTime,
}: PageSeoInput): Promise<Metadata> {
  const { siteName, defaultImage } = await siteContext(locale);
  const alternates = alternatesFor(locale, paths);
  const url = alternates.canonical as string;
  const image = resolveOgImage(locale, ...images, defaultImage);

  const otherLocales = SUPPORTED_LOCALES.filter(
    (candidate) => candidate !== locale && paths[candidate],
  ).map(ogLocale);

  return {
    title,
    ...(description ? { description } : {}),
    alternates,
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url,
      siteName,
      locale: ogLocale(locale),
      ...(otherLocales.length ? { alternateLocale: otherLocales } : {}),
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      images: [
        {
          url: image,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: [image],
    },
  };
}

/*
 * There is deliberately no `metadataBase` here.
 *
 * It would have to be a `URL`, and `generateMetadata` is cached on every route
 * (see the note in the layout), so the object has to survive serialisation -
 * a `URL` does not, and React rejects it at the cache boundary. It would earn
 * nothing anyway: everything this module emits is already absolute, because
 * the two locales are two hosts and a relative URL cannot say which one it
 * means.
 */
