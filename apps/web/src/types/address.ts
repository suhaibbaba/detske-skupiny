import type {
  ContactInfo,
  Geopoint,
  PostalAddress,
} from "@detske-skupiny/types";

/**
 * The address object, straight from the schema.
 *
 * The hand-written version declared `mapLocation` as required. It is optional
 * in the Studio, and a school without one is exactly the case the map has to
 * skip rather than place at (undefined, undefined).
 */
export type { ContactInfo, Geopoint, PostalAddress };
