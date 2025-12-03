import { SanityImageField } from "@/sanity/types/component";
import { SanityLinkField } from "@/components/ui/link/parser";

export type Settings = {
  siteTitle?: string;
  defaultImage?: SanityImageField;
  supportEmail?: string;
  officePhoneNumber?: string;
  socialLinks?: SanityLinkField[];
};
