import type {
  BlogPageQueryResult,
  RichText,
  SanityImageAssetReference,
} from "@detske-skupiny/types";

/**
 * Portable Text as the schema defines it.
 *
 * The hand-written version was `string | PortableTextBlock[]`, which let a
 * plain string in anywhere a rich text field was expected. No schema field is
 * both.
 */
export type SanityRichTextField = RichText;

/** An unprojected `image` field - `asset` still a reference. */
export type SanityImageField = {
  asset?: SanityImageAssetReference;
  hotspot?: unknown;
  crop?: unknown;
  _type: "image";
};

/** The `pageHero` object shared by blogPage, schoolPage, group and contactUs. */
export type PageHero = NonNullable<BlogPageQueryResult["pageHero"]>;

/** One CTA of a page hero, with its link resolved. */
export type SanityCtaField = NonNullable<PageHero["ctas"]>[number];
