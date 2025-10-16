import { defaultLocale } from "@/i18n/routing";

export let currentLocale = defaultLocale;

export function setLocale(locale: string) {
  currentLocale = locale;
}
