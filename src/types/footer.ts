import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { SanityLinkField } from "@/components/ui/link/parser";

export type FooterContent = {
  id: string;
  _type: string;
  text?: string;
  link?: SanityLinkField;
};

export type Footer = {
  logo?: SanityImageField;
  columns: {
    title?: string;
    content?: FooterContent[];
  }[];
  copyright?: string;
};
