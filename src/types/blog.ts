export type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  readTime?: number;
  publishedAt?: string;
  categories?: string[];
  author?: Author;
};

export type BlogPageContent = {
  title: string;
  description: any;
  ctas?: {
    text: string;
    url: string;
    variant?: string;
    openInNewTab?: boolean;
  }[];
};

export type Author = {
  _id: string;
  name?: string;
  image?: string;
  bio?: string;
  role?: string;
};
