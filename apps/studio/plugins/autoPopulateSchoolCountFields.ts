import { definePlugin, SanityClient } from "sanity";
import { DocumentActionComponent, useClient } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import { excludeDraft } from "@/utility";

type GeoType = { _id: string; count: number };

// Custom action to update school counts on demand
const UpdateSchoolCountsAction: DocumentActionComponent = (props) => {
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  return {
    label: "Update School Counts",
    icon: SparklesIcon,
    disabled: isUpdating,
    onHandle: async () => {
      setIsUpdating(true);

      // Show loading toast
      toast.push({
        status: "info",
        title: "Updating school counts...",
        description: "This may take a few moments",
        duration: Infinity,
        closable: true,
      });

      try {
        await updateSchoolCounts(client);

        // Show success toast
        toast.push({
          status: "success",
          title: "School counts updated successfully",
          description: "All region counts have been recalculated",
          duration: Infinity,
          closable: true,
        });
      } catch (error) {
        // Show error toast
        toast.push({
          status: "error",
          title: "Failed to update school counts",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        console.error("Error updating school counts:", error);
      } finally {
        setIsUpdating(false);
      }
    },
  };
};

// Function to update school counts across area, region, and country
async function updateSchoolCounts(client: SanityClient) {
  try {
    const [regions, areas, countries, subareas] = await Promise.all([
      client.fetch<GeoType[]>(`
      *[_type == "regions"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region._ref == ^._id])
      }
    `),
      client.fetch<GeoType[]>(`
      *[_type == "areas"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area._ref == ^._id])
      }
    `),
      client.fetch<GeoType[]>(`
      *[_type == "countries"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region->country._ref == ^._id])
      }
    `),
      client.fetch<GeoType[]>(`
      *[_type == "subareas"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && subarea._ref == ^._id])
      }
    `),
    ]);

    // Use transaction for atomic updates
    let transaction = client.transaction();

    for (const item of regions) {
      transaction = transaction.patch(item._id, {
        set: { schoolCount: item.count },
      });
    }

    for (const item of areas) {
      transaction = transaction.patch(item._id, {
        set: { schoolCount: item.count },
      });
    }

    for (const item of countries) {
      transaction = transaction.patch(item._id, {
        set: { schoolCount: item.count },
      });
    }

    for (const item of subareas) {
      transaction = transaction.patch(item._id, {
        set: { schoolCount: item.count },
      });
    }

    await transaction.commit();
  } catch (error) {
    console.error("Error updating school counts:", error);
    throw error;
  }
}

// Export as plugin
export const autoPopulateSchoolCountPlugin = definePlugin({
  name: "auto-populate-schools-count-fields",
  document: {
    actions: (prev, context) => {
      return [...prev, UpdateSchoolCountsAction];
    },
  },
});
