import { defineRouting, Pathnames } from "next-intl/routing";
import { LOCALES } from "@detske-skupiny/config/locales";

export const locales = LOCALES.map((locale) => locale.id);
export const defaultLocale = "cs";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";
const isDev = process.env.NODE_ENV === "development";

// Translation map for path segments
export const pathTranslations: Record<string, Record<string, string>> = {
  catalog: { en: "catalog", cs: "katalog" },
  articles: { en: "articles", cs: "clanky" },
  groups: { en: "groups", cs: "skupiny" },
  cooperation: { en: "cooperation", cs: "spoluprace" },
  "contact-us": { en: "contact-us", cs: "kontakt" },
};

export const pathnames = {
  "/": "/",
  "/articles": {
    en: "/articles",
    cs: "/clanky",
  },
  "/articles/[slug]": {
    en: "/articles/[slug]",
    cs: "/clanky/[slug]",
  },
  "/contact-us": {
    en: "/contact-us",
    cs: "/kontakt",
  },
  "/groups": {
    en: "/groups",
    cs: "/skupiny",
  },
  "/cooperation": {
    en: "/cooperation",
    cs: "/spoluprace",
  },
  "/groups/[group]": {
    en: "/groups/[group]",
    cs: "/skupiny/[group]",
  },
  "/catalog/[...slug]": {
    en: "/catalog/[...slug]",
    cs: "/katalog/[...slug]",
  },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale,
  domains: [
    {
      domain: isDev ? `${EN_DOMAIN}:3000` : EN_DOMAIN,
      defaultLocale: "en",
      locales: ["en"],
    },
    {
      domain: isDev ? `${CZ_DOMAIN}:3000` : CZ_DOMAIN,
      defaultLocale: "cs",
      locales: ["cs"],
    },
  ],
  localePrefix: { mode: "never" },
  pathnames,
});

export const localizeHref = (href: string, locale: string): string => {
  let localizedHref = href;

  Object.entries(pathTranslations).forEach(([_, translations]) => {
    const enPath = translations.en;
    const localizedSegment = translations[locale] || enPath;

    // Replace at start of path or after a slash
    localizedHref = localizedHref.replace(
      new RegExp(`(^|/)${enPath}(/|$)`, "g"),
      `$1${localizedSegment}$2`,
    );
  });

  return localizedHref;
};
