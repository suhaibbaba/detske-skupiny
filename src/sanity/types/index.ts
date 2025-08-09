import type { PortableTextBlock } from "@portabletext/types";

export type SanityRichText = string | PortableTextBlock[];

export interface SanityCtaField {
  text: string;
  url: string;
  variant: "primary" | "secondary" | "ghost";
  openInNewTab?: boolean;
}

export interface SanityImageField {
  alt?: string;
  crop?: {
    _type: "sanity.imageCrop";
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    _type: "sanity.imageHotspot";
    x: number;
    y: number;
    height: number;
    width: number;
  };
  asset?: {
    _id: string;
    url: string;
    mimeType?: string; // e.g. "image/jpeg", "image/svg+xml"
    extension?: string; // e.g. "jpg", "svg"
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
}
