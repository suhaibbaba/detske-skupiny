import { SanityCtaField, SanityImageField } from "@/sanity/types";

export type MenuItem = {
  id: string;
  name: string;
  className: string;
};

export type Header = {
  logo?: SanityImageField;
  menuItems: MenuItem[];
  cta?: SanityCtaField;
};
