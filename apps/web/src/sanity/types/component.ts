import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { SanityLinkField } from "@/components/ui/link/parser";

export type SanityRichTextField = string | PortableTextBlock[];

export interface SanityCtaField {
  _key: string;
  link: SanityLinkField;
  variant: "primary" | "secondary" | "ghost";
  openInNewTab?: boolean;
}

export type SanityImageField = SanityImageSource;

export interface PageHero {
  title: string;
  description: string;
  ctas?: SanityCtaField[];
}
