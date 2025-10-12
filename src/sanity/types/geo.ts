export type Area = {
  id: string;
  name: string;
  slug: string;
};

export type Region = {
  id: string;
  name: string;
  slug: string;
  backgroundCover: string;
  areas: Area[];
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type Coordinates = {
  coordinate: Coordinate;
  regionId?: string;
};
