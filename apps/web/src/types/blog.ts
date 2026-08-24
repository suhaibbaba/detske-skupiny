import type {
  BlogBySlugQueryResult,
  BlogPageQueryResult,
  MiniBlogsQueryResult,
} from "@detske-skupiny/types";

/** An article, as the detail page reads it. */
export type Blog = NonNullable<BlogBySlugQueryResult["blog"]>;

/** An article reduced to a card: no `content`, no `categories`. */
export type MiniBlog = NonNullable<MiniBlogsQueryResult["blogs"]>[number];

/** A card as the article index renders it - `MiniBlog` plus its category. */
export type BlogCard = NonNullable<BlogPageQueryResult["blogs"]>[number];

export type BlogCategory = NonNullable<
  BlogPageQueryResult["categories"]
>[number];

export type Author = NonNullable<BlogCard["author"]>;
