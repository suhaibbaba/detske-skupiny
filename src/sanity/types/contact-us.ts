import {
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types/component";

export interface ContactPerson {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface ContactUsItem {
  image: SanityImageField;
  title: string;
  description: SanityRichTextField;
}
