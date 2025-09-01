import { Area, Region } from "@/sanity/types/geo";
import { SchoolCategory, SchoolTag } from "@/sanity/types/school";

export type SchoolFilterQueryParams = {
  locale: string;
  regionSlug: string; // region slug
  areas?: string[]; // array of area slugs from GET (?area=ramallah&area=hebron)
  types?: string[]; // array of schoolCategories slugs (?type=kindergarten)
  tags?: string[]; // array of tag slugs (?tag=montessori)
};

export interface SchoolFilterModel {
  region: Region;
  totalSchools: number;
  totalSchoolsFiltered: number;
  mainAreas: (Area & { count: number })[];
  tags: (SchoolTag & { count: number })[];
  types: (SchoolCategory & { count: number })[];
}
