export const routes = {
  home: "/",
  blogs: (slug?: string) =>
    slug ? `/blogs/${encodeURIComponent(slug)}` : "/blogs",
  authors: (slug?: string) =>
    slug ? `/author/${encodeURIComponent(slug)}` : "/author",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  preschool: "/preschool",
  catalogs: (slug?: string) =>
    slug ? `/catalog/${encodeURIComponent(slug)}` : "/",
  school: (regionSlug?: string, slug?: string) =>
    slug && regionSlug
      ? `/catalog/${encodeURIComponent(regionSlug)}/${encodeURIComponent(slug)}`
      : "/",
};
