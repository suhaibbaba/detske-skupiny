import { SanityImageField } from "@/sanity/types/component";
import { Area } from "@/sanity/types/geo";
import { SchoolCategory } from "@/sanity/types/school";

export interface GroupPage {
  id: string;
  totalSchools: number;
  name: string;
  slug: string;
  backgroundCover: SanityImageField;
  areas: (Area & { schoolCount?: number })[];
  schoolCategories: (SchoolCategory & { schoolCount?: number })[];
}
