import { Area, Region } from "@/sanity/types/geo";
import { SchoolCategory, SchoolTag } from "@/sanity/types/school";

export type SchoolPageQueryParams = {
  country: string;
  region?: string;
};

export type SchoolFilterQueryParams = {
  country: string;
  region?: string;
  area?: string;
  subarea?: string;
  categories?: string[];
  tags?: string[];
  search?: string;
  start: number;
  end: number;
};

export interface SchoolFilterModel {
  region: Region;
  totalSchools: number;
  totalSchoolsFiltered: number;
  mainAreas: (Area & { count: number })[];
  tags: (SchoolTag & { count: number })[];
  categories: (SchoolCategory & { count: number })[];
}
