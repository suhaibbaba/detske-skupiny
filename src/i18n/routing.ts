import { defineRouting, Pathnames } from "next-intl/routing";

export const locales = ["cz", "en"];
export const defaultLocale = "cz";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";

export const pathnames = {
  "/": "/",
  "/blogs": {
    en: "/blogs",
    cz: "/blogy",
  },
  "/contact-us": {
    en: "/contact-us",
    cz: "/kontakt",
  },
  "/groups": {
    en: "/groups",
    cz: "/skupiny",
  },
  "/preschool": {
    en: "/preschool",
    cz: "/školka",
  },
  "/school/[school]": {
    en: "/school/[school]",
    cz: "/škola/[school]",
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
      domain: EN_DOMAIN,
      defaultLocale: "en",
      locales: ["en"],
    },
    {
      domain: CZ_DOMAIN,
      defaultLocale: "cz",
      locales: ["cz"],
    },
  ],
  localePrefix: { mode: "never" },
  pathnames,
});
