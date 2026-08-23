export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  extra?: string;
  mapLocation?: {
    _type: "geopoint";
    lat: number;
    lng: number;
  };
}
