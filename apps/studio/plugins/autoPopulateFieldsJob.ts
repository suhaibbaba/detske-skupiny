import { definePlugin, SanityClient } from "sanity";
import { DocumentActionComponent, useClient } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import { Address } from "@/types/school";
import { getGeoLocationBatch } from "@/utility/geoLocation";
import { excludeDraft, removeDiacritics } from "@/utility";

type GeoType = {
  _id: string;
  count?: number;
  slug?: string;
  regionSlug?: string;
  countrySlug?: string;
  areaSlug?: string;
};

export type SchoolType = {
  _id: string;
  name: string;
  regionSlug?: string;
  countrySlug?: string;
  address?: Address;
};

// Custom action to update school counts on demand
const UpdateFieldsAction: DocumentActionComponent = (props) => {
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });

  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  return {
    label: "Run All Custom Plugins",
    icon: SparklesIcon,
    disabled: isUpdating,
    onHandle: async () => {
      setIsUpdating(true);

      // Show loading toast
      toast.push({
        status: "info",
        title: "Run All Custom Plugins...",
        description: "This may take a few moments",
        duration: Infinity,
        closable: true,
      });

      try {
        await updateFields(client);

        // Show success toast
        toast.push({
          status: "success",
          title: "Fields updated successfully",
          description: "Fields have been updated.",
          duration: Infinity,
          closable: true,
        });
      } catch (error) {
        // Show error toast
        toast.push({
          status: "error",
          title: "Failed to update fields.",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        console.error("Error updating fields:", error);
      } finally {
        setIsUpdating(false);
      }
    },
  };
};

async function updateFields(client: SanityClient) {
  try {
    const [countries, regions, areas, subareas, schools] = await Promise.all([
      client.fetch<GeoType[]>(`
        *[_type == "countries"] {
          _id,
          "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region->country->slug.current == ^.slug.current])
        }
      `),
      client.fetch<GeoType[]>(`
        *[_type == "regions"] {
          _id,
          "slug": slug.current,
          "countrySlug": country->slug.current,
          "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region._ref == ^._id])
        }
      `),
      client.fetch<GeoType[]>(`
        *[_type == "areas"] {
          _id,
          "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area._ref == ^._id]),
          "slug": slug.current,
          "regionSlug": region->slug.current,
          "countrySlug": region->country->slug.current
        }
      `),
      client.fetch<GeoType[]>(`
        *[_type == "subareas"] {
          _id,
          "slug": slug.current,
          "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && subarea._ref == ^._id]),
          "areaSlug": area->slug.current,
          "regionSlug": area->region->slug.current,
          "countrySlug": area->region->country->slug.current
        }
      `),
      client.fetch<SchoolType[]>(`
        *[_type == "schools"] {
          _id,
          name,
          "regionSlug": area->region->slug.current,
          "countrySlug": area->region->country->slug.current,
          address,
        }
      `),
    ]);

    // Use transaction for atomic updates
    let transaction = client.transaction();

    // Only patch if count is defined
    for (const item of countries) {
      if (item.count !== undefined) {
        transaction = transaction.patch(item._id, {
          set: { schoolCount: item.count },
        });
      }
    }

    for (const item of regions) {
      if (item.count !== undefined) {
        transaction = transaction.patch(item._id, {
          set: {
            schoolCount: item.count,
            countrySlug: item.countrySlug,
            fullSlug: `/${item.countrySlug}/${item.slug}`,
          },
        });
      }
    }

    for (const item of areas) {
      // Only update if we have all required data
      if (item.slug && item.regionSlug && item.countrySlug) {
        transaction = transaction.patch(item._id, {
          set: {
            schoolCount: item.count ?? 0,
            countrySlug: item.countrySlug,
            regionSlug: item.regionSlug,
            fullSlug: `/${item.countrySlug}/${item.regionSlug}/${item.slug}`,
          },
        });
      }
    }

    for (const item of subareas) {
      // Only update if we have all required data
      if (item.slug && item.areaSlug && item.regionSlug && item.countrySlug) {
        transaction = transaction.patch(item._id, {
          set: {
            schoolCount: item.count ?? 0,
            countrySlug: item.countrySlug,
            regionSlug: item.regionSlug,
            fullSlug: `/${item.countrySlug}/${item.regionSlug}/${item.areaSlug}/${item.slug}`,
          },
        });
      }
    }

    // Update countrySlug/regionSlug for schools
    for (const item of schools) {
      const patchData: any = {
        nameNormalized: removeDiacritics(item.name || ""),
        countrySlug: item.countrySlug,
        regionSlug: item.regionSlug,
      };

      transaction = transaction.patch(item._id, {
        set: patchData,
      });
    }

    // Update lat/lng for schools
    const schoolsMissingAddress = schools.filter(
      (school) =>
        !school.address?.mapLocation?.lat || !school.address?.mapLocation?.lat,
    );

    const geoResults = await getGeoLocationBatch(schoolsMissingAddress);

    // Update lat/lng for schools
    for (const result of geoResults) {
      if (result.success && result.lat && result.lng) {
        transaction = transaction.patch(result.schoolId, {
          set: {
            "address.mapLocation": {
              _type: "geopoint",
              lat: result.lat,
              lng: result.lng,
            },
          },
        });
      } else {
        console.warn(
          `Failed to geocode school ${result.schoolId}: ${result.error || "Unknown error"}`,
        );
      }
    }

    await transaction.commit();
  } catch (error) {
    console.error("Error updating fields:", error);
    throw error;
  }
}

// Export as plugin
export const autoPopulateFieldsJobPlugin = definePlugin({
  name: "auto-populate-fields-jobs",
  document: {
    actions: (prev, context) => {
      return [...prev, UpdateFieldsAction];
    },
  },
});
