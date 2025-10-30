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
