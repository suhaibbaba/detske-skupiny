import { defineRouting, Pathnames } from "next-intl/routing";

export const locales = ["cz", "en"];
export const defaultLocale = "cz";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";
const isDev = process.env.NODE_ENV === "development";

// Translation map for path segments
export const pathTranslations: Record<string, Record<string, string>> = {
  catalog: { en: "catalog", cz: "katalog" },
  articles: { en: "articles", cz: "clanky" },
  groups: { en: "groups", cz: "skupiny" },
  cooperation: { en: "cooperation", cz: "spoluprace" },
  "contact-us": { en: "contact-us", cz: "kontakt" },
};

export const pathnames = {
  "/": "/",
  "/articles": {
    en: "/articles",
    cz: "/clanky",
  },
  "/contact-us": {
    en: "/contact-us",
    cz: "/kontakt",
  },
  "/groups": {
    en: "/groups",
    cz: "/skupiny",
  },
  "/cooperation": {
    en: "/cooperation",
    cz: "/spoluprace",
  },
  "/groups/[group]": {
    en: "/groups/[group]",
    cz: "/skupiny/[group]",
  },
  "/catalog/[...slug]": {
    en: "/catalog/[...slug]",
    cz: "/katalog/[...slug]",
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
      defaultLocale: "cz",
      locales: ["cz"],
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
      `$1${localizedSegment}$2`
    );
  });

  return localizedHref;
};
