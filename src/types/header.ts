import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { SanityLinkField } from "@/components/ui/link/parser";

export type MenuItem = {
  id: string;
  link: SanityLinkField;
};

export type Header = {
  logo?: SanityImageField;
  menuItems: MenuItem[];
  cta?: SanityCtaField;
};
