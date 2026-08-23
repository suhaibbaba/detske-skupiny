export enum FilterTypes {
  country = "0",
  region = "1",
  area = "2",
  subarea = "3",
}

export interface CatalogParams {
  level: string;
  country?: string;
  region?: string;
  area?: string;
  subarea?: string;
}

export function getSelectedSlug(params: CatalogParams): string {
  return (
    "/" +
    [params.country, params.region, params.area, params.subarea]
      .filter(Boolean) // remove undefined or empty values
      .join("/")
  );
}

export function parseCatalogSlug(slug: string[] = []): CatalogParams | null {
  switch (slug.length) {
    case 1:
      return { level: FilterTypes.country, country: slug[0] };
    case 2:
      return { level: FilterTypes.region, country: slug[0], region: slug[1] };
    case 3:
      return {
        level: FilterTypes.area,
        country: slug[0],
        region: slug[1],
        area: slug[2],
      };
    case 4:
      return {
        level: FilterTypes.subarea,
        country: slug[0],
        region: slug[1],
        area: slug[2],
        subarea: slug[3],
      };
    default:
      // Empty slug, or 5+ segments: no such catalog page.
      return null;
  }
}
