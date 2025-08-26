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
  id: string;
  name: string;
  slug: string;
  schoolCount: number;
};

export type SchoolType = {
  id: string;
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

export interface ContactPerson {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface TransportItem {
  type?: string;
  name?: string;
  mode?: string;
  distance?: string;
}

export interface TimeRow {
  _key: string;
  start?: string;
  end?: string;
  activity?: string;
}

interface PostalAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  extra?: string;
}

export interface GeoPoint {
  lat: number;
  /**
   * Longitude in degrees
   */
  lng: number;
  /**
   * Altitude in meters
   */
  alt?: number;
}

interface Link {
  _key: string;
  _type: string;
  blank: boolean;
  type: string;
  url: string;
}

export interface School {
  id: string;
  logo: SanityImageField;
  name: string;
  slug: string;
  primaryImages: SanityImageField[];
  area?: Area | null;
  address?: PostalAddress | null;
  location?: GeoPoint | null;
  contacts?: ContactPerson[];
  links?: Link[];
  types?: SchoolType[];
  transportation?: TransportItem[];
  about?: SanityRichTextField;
  highlights?: SanityRichTextField;
  timetable?: TimeRow[];
  isPrivate?: boolean;
  gallery?: SanityImageField[];
  notes?: string | null;
}
