import { definePlugin } from "sanity";
import {
  DocumentActionComponent,
  useDocumentOperation,
  useClient,
} from "sanity";

type SubareaDocument = {
  _id: string;
  _type: string;
  area?: {
    _ref: string;
  };
  slug?: {
    current: string;
  };
  countrySlug?: string;
  regionSlug?: string;
  fullSlug?: string;
};

// This action runs whenever a subarea document is published
const AutoPopulateSubareaFieldsAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const draft = props.draft as SubareaDocument | null;

  return {
    label: "Publish",
    onHandle: async () => {
      // Only run for subareas
      if (props.type !== "subareas") {
        publish.execute();
        return;
      }

      // Get the area reference
      const areaRef = draft?.area?._ref;

      if (areaRef) {
        // Fetch the referenced data
        const areaData = await client.fetch(
          `*[_id == $areaRef][0]{
            "areaSlug": slug.current,
            "regionSlug": region->slug.current,
            "countrySlug": region->country->slug.current
          }`,
          { areaRef },
        );

        if (areaData) {
          const subSlug = draft?.slug?.current || "";

          // Patch the document with computed fields
          patch.execute([
            {
              set: {
                countrySlug: areaData.countrySlug,
                regionSlug: areaData.regionSlug,
                fullSlug: `/${areaData.countrySlug}/${areaData.regionSlug}/${areaData.areaSlug}/${subSlug}`,
              },
            },
          ]);

          // Small delay to ensure patch completes
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Now publish
      publish.execute();
    },
  };
};

// Export as plugin
export const autoPopulateSubAreaPlugin = definePlugin({
  name: "auto-populate-subarea-fields",
  document: {
    actions: (prev, context) => {
      // Replace the default publish action for subareas
      if (context.schemaType === "subareas") {
        return prev.map((action) =>
          action.action === "publish"
            ? AutoPopulateSubareaFieldsAction
            : action,
        );
      }
      return prev;
    },
  },
});
