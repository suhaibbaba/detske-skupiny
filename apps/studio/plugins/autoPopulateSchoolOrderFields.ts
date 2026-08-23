import { definePlugin, SanityClient } from "sanity";
import { DocumentActionComponent, useClient } from "sanity";
import { SparklesIcon } from "@sanity/icons/Sparkles";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import { excludeDraft } from "@/utility";

// Custom action to update school sortOrder on demand
const UpdateSchoolSortOrderAction: DocumentActionComponent = (props) => {
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  return {
    label: "Update School SortOrder",
    icon: SparklesIcon,
    disabled: isUpdating,
    onHandle: async () => {
      setIsUpdating(true);

      // Show loading toast
      toast.push({
        status: "info",
        title: "Updating school SortOrder...",
        description: "This may take a few moments",
        duration: Infinity,
        closable: true,
      });

      try {
        await updateSchoolSortOrder(client);

        // Show success toast
        toast.push({
          status: "success",
          title: "School SortOrder updated successfully",
          description: "All schools SortOrder field have been recalculated",
          duration: Infinity,
          closable: true,
        });
      } catch (error) {
        // Show error toast
        toast.push({
          status: "error",
          title: "Failed to update school SortOrder",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
        console.error("Error updating school SortOrder:", error);
      } finally {
        setIsUpdating(false);
      }
    },
  };
};

// Function to update sortOrder for schools
async function updateSchoolSortOrder(client: SanityClient) {
  try {
    const [schools] = await Promise.all([
      client.fetch<{ _id: string; types?: { highPriority?: boolean }[] }[]>(`
      *[_type == "schools" && ${excludeDraft}]{
        _id,
        types[]->{
          highPriority
        },   
      }
    `),
    ]);

    console.log(`Updating SortOrder for ${schools.length} schools`);

    // Use transaction for atomic updates
    let transaction = client.transaction();
    const usedNumbers = new Set<number>();

    const getUniqueSortOrder = (): number => {
      let sortOrder: number;
      do {
        sortOrder = Math.floor(Math.random() * 10000);
      } while (usedNumbers.has(sortOrder));
      usedNumbers.add(sortOrder);
      return sortOrder;
    };

    for (const item of schools) {
      const uniqueSortOrder = getUniqueSortOrder();
      transaction = transaction.patch(item._id, {
        set: {
          sortOrder: uniqueSortOrder,
          isHighPriority:
            item.types?.some((value) => value.highPriority) || false,
        },
      });
    }

    await transaction.commit();
  } catch (error) {
    console.error("Error updating School SortOrder:", error);
    throw error;
  }
}

// Export as plugin
export const autoPopulateSchoolSortOrderPlugin = definePlugin({
  name: "auto-populate-schools-sort-order-fields",
  document: {
    actions: (prev, context) => {
      return [...prev, UpdateSchoolSortOrderAction];
    },
  },
});
