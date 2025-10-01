export const routes = {
  home: "/",
  blogs: (slug?: string) =>
    slug ? `/blogs/${encodeURIComponent(slug)}` : "/blogs",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  preschool: "/preschool",
  catalogs: (slug?: string) => (slug ? `/catalog/${slug}` : "/"),
  school: (regionSlug?: string, slug?: string) =>
    slug && regionSlug
      ? `/catalog/${encodeURIComponent(regionSlug)}/${encodeURIComponent(slug)}`
      : "/",
};
