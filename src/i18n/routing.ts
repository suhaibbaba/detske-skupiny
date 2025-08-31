import { defineRouting } from "next-intl/routing";

export const locales = ["cz", "en"];
export const defaultLocale = "en";

export const routing = defineRouting({
  locales: locales,
  localePrefix: "as-needed",
  defaultLocale: defaultLocale,
});
