import { defaultLocale, localizeHref } from "@/i18n/routing";

const joinPath = (base: string, slug: string) =>
  `${base}/${slug.replace(/^\/+/, "")}`;

export const getLocalizedRoutes = (locale: string = defaultLocale) => ({
  home: localizeHref("/", locale),
  about: localizeHref("/about", locale),
  contactUs: localizeHref("/contact-us", locale),
  groups: localizeHref("/groups", locale),
  cooperation: localizeHref("/cooperation", locale),
  article: (slug?: string) =>
    localizeHref(slug ? joinPath("/articles", slug) : "/articles", locale),
  catalogs: (slug?: string, query?: string) => {
    const basePath = slug ? joinPath("/catalog", slug) : "/";
    const url = localizeHref(basePath, locale);
    return query ? `${url}?${query}` : url;
  },
  group: (slug?: string) =>
    localizeHref(slug ? joinPath("/groups", slug) : "/groups", locale),
});
