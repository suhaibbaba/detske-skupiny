import { Area, Region } from "@/sanity/types/geo";
import { SchoolCategory, SchoolTag } from "@/sanity/types/school";

export type SchoolFilterQueryParams = {
  country: string;
  region?: string;
  area?: string;
  subarea?: string;
  types?: string[];
  tags?: string[];
  search?: string;
};

export interface SchoolFilterModel {
  region: Region;
  totalSchools: number;
  totalSchoolsFiltered: number;
  mainAreas: (Area & { count: number })[];
  tags: (SchoolTag & { count: number })[];
  types: (SchoolCategory & { count: number })[];
}
