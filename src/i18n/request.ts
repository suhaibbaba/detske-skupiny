import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getDictionary } from "@/sanity/queries";

export default getRequestConfig(
  async ({ locale: localeProps, requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : localeProps || routing.defaultLocale;

    const messages = await getDictionary(locale);

    console.log({
      messages,
      locale,
    });
    return {
      locale,
      messages,
    };
  },
);
