export const routes = {
  home: "/",
  blogs: (slug?: string) =>
    slug ? `/blog/${encodeURIComponent(slug)}` : "/blog",
  authors: (slug?: string) =>
    slug ? `/author/${encodeURIComponent(slug)}` : "/author",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  preschool: "/preschool",
};
