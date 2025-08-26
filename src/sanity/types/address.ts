export interface PostalAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  extra?: string;
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
