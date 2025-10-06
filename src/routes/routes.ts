export const routes = {
  home: "/",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  preschool: "/preschool",
  blogs: (slug?: string) => (slug ? ["/blogs", slug].join("/") : "/blogs"),
  catalogs: (slug?: string) => (slug ? ["/catalog", slug].join("/") : "/"),
  school: (slug?: string) => (slug ? ["/school", slug].join("/") : "/"),
};
