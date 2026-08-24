/**
 * How deep into the geography tree a catalog URL points.
 *
 * Lives in `types/` rather than in `features/catalog` because lib/sanity/seo.ts
 * needs it to map a level onto the document type behind it, and lib must not
 * reach up into a feature. The string values are the levels' depth, which is
 * how the catalog's own parser produces them.
 */
export enum FilterTypes {
  country = "0",
  region = "1",
  area = "2",
  subarea = "3",
}

export type SchoolPageQueryParams = {
  country: string;
  region?: string;
  locale: string;
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
  locale: string;
};
