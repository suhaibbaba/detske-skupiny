import { defaultLocale, localizeHref } from "@/i18n/routing";

/**
 * Every slug here arrives from a GROQ projection, where an unset field is
 * `null` rather than `undefined` - so these accept both and treat them the
 * same as the empty string they already handled.
 */
type Slug = string | null | undefined;

const joinPath = (base: string, slug: string) =>
  `${base}/${slug.replace(/^\/+/, "")}`;

export const getLocalizedRoutes = (locale: string = defaultLocale) => ({
  home: localizeHref("/", locale),
  contactUs: localizeHref("/contact-us", locale),
  groups: localizeHref("/groups", locale),
  cooperation: localizeHref("/cooperation", locale),
  article: (slug?: Slug) =>
    localizeHref(slug ? joinPath("/articles", slug) : "/articles", locale),
  catalogs: (slug?: Slug, query?: string) => {
    const basePath = slug ? joinPath("/catalog", slug) : "/";
    const url = localizeHref(basePath, locale);
    return query ? `${url}?${query}` : url;
  },
  group: (slug?: Slug) =>
    localizeHref(slug ? joinPath("/groups", slug) : "/groups", locale),
});
