import {
  Area,
  ContactPerson,
  GeoPoint,
  Link,
  PostalAddress,
  Region,
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types";

export interface MiniSchool {
  id: string;
  name: string;
  slug: string;
  logo: SanityImageField;
  region: Region;
  primaryImage: SanityImageField;
  shortSummary: string;
  website?: {
    url?: string;
  };
  tags?: SchoolTag[];
  area?: Area;
}

export interface TransportOption {
  type?: string;
  name?: string;
  mode?: string;
  distance?: string;
}

export interface TimetableRow {
  _key: string;
  start?: string;
  end?: string;
  activity?: string;
}

export type SchoolCategory = {
  id: string;
  name: string;
  slug: string;
  emoji: SanityImageField;
};

export type SchoolTag = {
  id: string;
  name: string;
  slug: string;
  emoji: SanityImageField;
  borderColor: string;
};

export interface School {
  id: string;
  logo: SanityImageField;
  name: string;
  slug: string;
  primaryImage: SanityImageField | null;
  primaryImages: SanityImageField[];
  region: Region;
  area: Area;
  address?: PostalAddress | null;
  location?: GeoPoint | null;
  contacts?: ContactPerson[];
  links?: Link[];
  types?: SchoolCategory[];
  transportation?: TransportOption[];
  about?: SanityRichTextField;
  highlights?: SanityRichTextField;
  timetable?: TimetableRow[];
  isPrivate?: boolean;
  gallery?: SanityImageField[];
  notes?: string | null;
}
