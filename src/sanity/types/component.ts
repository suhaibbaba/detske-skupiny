import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type SanityRichTextField = string | PortableTextBlock[];

export interface SanityCtaField {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "ghost";
  openInNewTab?: boolean;
}

export type SanityImageField = SanityImageSource;

export interface Link {
  _key: string;
  _type: string;
  blank: boolean;
  type: string;
  url: string;
}

export interface PageHero {
  title: string;
  description: string;
  ctas?: SanityCtaField[];
}
