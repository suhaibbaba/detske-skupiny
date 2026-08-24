import { headers } from "next/headers";
import { defaultLocale, locales, routing } from "@/i18n/routing";

/**
 * Where each locale lives, and how to turn a path into an absolute URL.
 *
 * The site is one deployment serving two hosts - next-intl routes by domain
 * (`localePrefix: "never"`), so the locale of a request is decided entirely by
 * its Host header and there is no `/cs` or `/en` prefix to read a locale out
 * of. Everything SEO emits is absolute and therefore has to know which host it
 * is talking about, which is why this module exists rather than every caller
 * reading the two env vars again.
 *
 * The domains come from `routing.domains` rather than the env vars directly,
 * so the port suffix dev mode appends is picked up here too and the canonical
 * URLs a local run emits actually resolve.
 */
const domainByLocale = new Map<string, string>(
  (routing.domains ?? []).map((entry) => [entry.defaultLocale, entry.domain]),
);

const isDev = process.env.NODE_ENV === "development";

/** http locally (the dev domains carry `:3000`), https everywhere else. */
const protocol = isDev ? "http" : "https";

/** Host without its port, for comparing a request's Host to the config. */
const hostname = (value: string) => value.split(":")[0].toLowerCase();

const localeByHostname = new Map<string, string>(
  [...domainByLocale].map(([locale, domain]) => [hostname(domain), locale]),
);

export const SUPPORTED_LOCALES = locales;

/** `https://en.detskeskupinky.cz` - no trailing slash. */
export function originFor(locale: string): string {
  const domain =
    domainByLocale.get(locale) ?? domainByLocale.get(defaultLocale);
  return `${protocol}://${domain}`;
}

/**
 * An absolute URL for a path that is *already localized* for `locale`.
 *
 * Callers get their paths from `getLocalizedRoutes(locale)`, which is the only
 * place that knows `/catalog` is `/katalog` in Czech. This function does not
 * translate anything - handing it an English path with a Czech locale produces
 * a URL that 404s, exactly as it should.
 */
export function absoluteUrl(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  // The home page is "https://host", not "https://host/". Next strips the
  // lone trailing slash when it resolves a canonical or an hreflang link
  // (`trailingSlash` is off), so producing it here would leave the sitemap
  // naming the home page differently from the page's own canonical. The two
  // resolve to the same resource, but they should still read the same.
  if (normalized === "/") return originFor(locale);

  return `${originFor(locale)}${normalized}`;
}

/** The locale a Host header maps to, or `undefined` for an unknown host. */
export function localeForHost(
  host: string | null | undefined,
): string | undefined {
  if (!host) return undefined;
  return localeByHostname.get(hostname(host));
}

/**
 * The locale of the current request, read from its Host header.
 *
 * `sitemap.ts` and `robots.ts` sit outside `app/[locale]`, are excluded from
 * the next-intl proxy by its matcher (both paths contain a dot), and are
 * handed no params - so the Host header is the only thing that says which of
 * the two sites is being asked. Reading it makes those routes dynamic, which
 * is correct: one deployment has to answer both hosts differently.
 */
export async function localeFromRequest(): Promise<string> {
  const requestHeaders = await headers();
  return localeForHost(requestHeaders.get("host")) ?? defaultLocale;
}
