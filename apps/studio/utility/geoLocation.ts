import { SchoolType } from "@/plugins/autoPopulateFieldsJob";

export const getGeoLocation = async (address?: SchoolType["address"]) => {
  if (!address) {
    return;
  }

  const MAPTILER_API_KEY = import.meta.env.SANITY_STUDIO_API_MAPTILER_API_KEY;

  const street = address?.street;
  const city = address?.city;
  const postalCode = address?.postalCode;
  const extra = address?.extra;

  const addressString = [street, city, postalCode, extra]
    .filter(Boolean)
    .join(", ");

  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(addressString)}.json?key=${MAPTILER_API_KEY}&types=poi&limit=1`,
  );

  const data = await response.json();

  if (data.features && data.features[0]) {
    const [lng, lat] = data.features[0].center;
    return {
      lat: lat,
      lng: lng,
    };
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGeoLocationBatch = async (
  schools: SchoolType[],
  batchSize: number = 50,
  delayBetweenBatches: number = 1000,
) => {
  const MAPTILER_API_KEY = import.meta.env.SANITY_STUDIO_API_MAPTILER_API_KEY;
  const allResults: Array<{
    schoolId: string; // Add school identifier
    address: string;
    lat: number | null;
    lng: number | null;
    success: boolean;
    error?: string;
  }> = [];

  // Split addresses into batches of 50
  for (let i = 0; i < schools.length; i += batchSize) {
    const batch = schools.slice(i, i + batchSize);

    // Process current batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (school) => {
        const street = school.address?.street;
        const city = school.address?.city;
        const postalCode = school.address?.postalCode;
        const extra = school.address?.extra;

        const addressString = [street, city, postalCode, extra]
          .filter(Boolean)
          .join(", ");

        // Skip if no address components
        if (!addressString) {
          return {
            schoolId: school._id || "",
            address: "",
            lat: null,
            lng: null,
            success: false,
            error: "No address provided",
          };
        }

        try {
          const response = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(addressString)}.json?key=${MAPTILER_API_KEY}&types=poi&limit=1`,
          );

          const data = await response.json();

          if (data.features && data.features[0]) {
            const [lng, lat] = data.features[0].center;
            return {
              schoolId: school._id || "",
              address: addressString,
              lat,
              lng,
              success: true,
            };
          }

          return {
            schoolId: school._id || "",
            address: addressString,
            lat: null,
            lng: null,
            success: false,
            error: "No geocoding results found",
          };
        } catch (error) {
          return {
            schoolId: school._id || "",
            address: addressString,
            lat: null,
            lng: null,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    allResults.push(...batchResults);

    // Add delay between batches (except after the last batch)
    if (i + batchSize < schools.length) {
      await sleep(delayBetweenBatches);
    }
  }

  return allResults;
};
