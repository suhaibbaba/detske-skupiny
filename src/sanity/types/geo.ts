export type Area = {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
};

export type Region = {
  id: string;
  name: string;
  slug: string;
  backgroundCover: string;
  areas: Area[];
  fullSlug: string;
  countrySlug: string;
};

export type MapCoordinate = {
  lat: number;
  lng: number;
};

export interface MarkerData {
  id: string;
  coordinate: MapCoordinate;
  selectedRegionId?: string;
  name?: string;
  fullAddress?: string;
  slug?: string;
}
