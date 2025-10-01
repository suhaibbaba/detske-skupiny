import {
  Area,
  ContactPerson,
  GeoPoint,
  PostalAddress,
  Region,
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types";
import { SanityLinkField } from "@/components/ui/link/parser";

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
  backgroundColor: string;
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
  links?: (SanityLinkField & { id: string })[];
  website?: SanityLinkField;
  types?: SchoolCategory[];
  transportation?: TransportOption[];
  about?: SanityRichTextField;
  highlights?: SanityRichTextField;
  timetable?: TimetableRow[];
  isPrivate?: boolean;
  gallery?: SanityImageField[];
  notes?: string | null;
}
