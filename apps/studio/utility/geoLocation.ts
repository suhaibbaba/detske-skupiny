import { Address } from "@/types/school";

/**
 * Geocodes a postal address to a coordinate via MapTiler.
 *
 * Called from the publish action in plugins/computedFields.ts, for one school
 * at a time - the batching helper that used to live here belonged to the
 * dataset-wide job plugin and went with it.
 *
 * Returns `undefined` rather than throwing when the address does not resolve:
 * a school with an unrecognised address should still publish, just without a
 * map pin. A network or HTTP failure does throw, and the caller surfaces it.
 */
export const getGeoLocation = async (address?: Address) => {
  if (!address) {
    return;
  }

  const MAPTILER_API_KEY = import.meta.env.SANITY_STUDIO_API_MAPTILER_API_KEY;

  const addressString = [
    address.street,
    address.city,
    address.postalCode,
    address.extra,
  ]
    .filter(Boolean)
    .join(", ");

  if (!addressString) {
    return;
  }

  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(addressString)}.json?key=${MAPTILER_API_KEY}&types=address&limit=1`,
  );

  if (!response.ok) {
    throw new Error(
      `Geocoding failed for "${addressString}" (${response.status})`,
    );
  }

  const data = await response.json();

  if (data.features && data.features[0]) {
    const [lng, lat] = data.features[0].center;
    return { lat, lng };
  }
};
