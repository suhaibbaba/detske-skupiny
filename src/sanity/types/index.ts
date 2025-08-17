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

export type Area = {
  name: string;
  slug: string;
  schoolCount: number;
};

export type SchoolType = {
  name: string;
  slug: string;
  schoolCount: number;
  emoji: string;
};

export type Region = {
  name: string;
  slug: string;
  backgroundCover: string;
  totalSchools: number;
  areas: Area[];
  schoolTypes: SchoolType[];
};
