import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SanityLinkField } from "@/components/ui/link/parser";

export type SanityRichTextField = string | PortableTextBlock[];

export interface SanityCtaField {
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
