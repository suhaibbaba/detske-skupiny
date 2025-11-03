const joinPath = (base: string, slug: string) =>
  `${base}/${slug.replace(/^\/+/, "")}`;

export const routes = {
  home: "/",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  cooperation: "/cooperation",
  article: (slug?: string) =>
    slug ? joinPath("/articles", slug) : "/articles",
  catalogs: (slug?: string) => (slug ? joinPath("/catalog", slug) : "/"),
  group: (slug?: string) => (slug ? joinPath("/groups", slug) : "/"),
};
