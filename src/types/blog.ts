import { SanityRichTextField } from "@/sanity/types";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: SanityRichTextField;
  image?: string;
  readTime?: number;
  publishedAt?: string;
  categories?: BlogCategory[];
  author?: Author;
};

export type BlogCategory = {
  name: string;
  slug: string;
};

export type Author = {
  _id: string;
  name?: string;
  image?: string;
  bio?: string;
  role?: string;
};
