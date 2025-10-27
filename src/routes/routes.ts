const joinPath = (base: string, slug: string) =>
  `${base}/${slug.replace(/^\/+/, "")}`;

export const routes = {
  home: "/",
  about: "/about",
  contactUs: "/contact-us",
  groups: "/groups",
  preschool: "/preschool",
  blogs: (slug?: string) => (slug ? joinPath("/blogs", slug) : "/blogs"),
  catalogs: (slug?: string) => (slug ? joinPath("/catalog", slug) : "/"),
  school: (slug?: string) => (slug ? joinPath("/school", slug) : "/"),
};
