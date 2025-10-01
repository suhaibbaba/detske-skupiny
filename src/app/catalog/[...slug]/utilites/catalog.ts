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
  switch (params.level) {
    case FilterTypes.country:
      return `/${params.country}`;
    case FilterTypes.region:
      return `/${params.country}/${params.region}`;
    case FilterTypes.area:
      return `/${params.country}/${params.region}/${params.area}`;
    case FilterTypes.subarea:
      return `/${params.country}/${params.region}/${params.area}/${params.subarea}`;
    default:
      return "";
  }
}

export function parseCatalogSlug(slug: string[] = []): CatalogParams {
  switch (slug.length) {
    case 1:
      return { level: FilterTypes.country, country: slug[0] };
    case 2:
      return { level: FilterTypes.region, country: slug[0], region: slug[1] };
    case 3:
      return {
        level: FilterTypes.subarea,
        country: slug[0],
        region: slug[1],
        area: slug[2],
        subarea: slug[3],
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
      throw new Error("Invalid catalog path");
  }
}
