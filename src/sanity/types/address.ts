import { MapCoordinate } from "@/sanity/types/geo";

export interface PostalAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  extra?: string;
  mapLocation: MapCoordinate;
}

export interface GeoPoint {
  lat: number;
  /**
   * Longitude in degrees
   */
  lng: number;
  /**
   * Altitude in meters
   */
  alt?: number;
}
