import { SanityRichTextField } from "@/sanity/types";

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
