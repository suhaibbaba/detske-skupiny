import { SanityRichTextField } from "@/sanity/types";
import type { TranslationPath } from "@/sanity/queries/seo";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: BlogCategory;
  content?: SanityRichTextField;
  image?: string;
  readTime?: number;
  publishedAt?: string;
  /** `_updatedAt`, used as the article's `dateModified`. */
  updatedAt?: string;
  /** The other locale's version, from `translation.metadata`. */
  translations?: TranslationPath[] | null;
  categories?: BlogCategory[];
  author?: Author;
};

export type MiniBlog = Omit<Blog, "categories" | "content">;

export type BlogCategory = {
  name: string;
  slug: string;
};

export type Author = {
  id: string;
  name?: string;
  image?: string;
  bio?: string;
  role?: string;
};
