export const languageQuery = `(language == $locale || !defined(language))`;
export const excludeDraft = `!(_id in path("drafts.**"))`;

export * from "@/sanity/queries/page";
export * from "@/sanity/queries/schools";
export * from "@/sanity/queries/school-filter";
export * from "@/sanity/queries/groups";
export * from "@/sanity/queries/blog";
export * from "@/sanity/queries/blog-details";
export * from "@/sanity/queries/contact-us";
export * from "@/sanity/queries/dictionary";
