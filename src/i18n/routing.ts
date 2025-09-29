import { defineRouting } from "next-intl/routing";

export const locales = ["cz", "en"];
export const defaultLocale = "en";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";

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
});
