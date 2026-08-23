import { definePlugin } from "sanity";
import {
  DocumentActionComponent,
  useDocumentOperation,
  useClient,
} from "sanity";

type RegionDocument = {
  _id: string;
  _type: string;
  country?: {
    _ref: string;
  };
  slug?: {
    current: string;
  };
  countrySlug?: string;
  fullSlug?: string;
};

// This action runs whenever a Region document is published
const AutoPopulateRegionFieldsAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const draft = props.draft as RegionDocument | null;

  return {
    label: "Publish",
    onHandle: async () => {
      // Only run for Regions
      if (props.type !== "regions") {
        publish.execute();
        return;
      }

      // Get the Region reference
      const countryRef = draft?.country?._ref;

      if (countryRef) {
        // Fetch the referenced data
        const countryData = await client.fetch(
          `*[_id == $countryRef][0]{
              "countrySlug": slug.current
          }`,
          { countryRef },
        );

        if (countryData) {
          const subSlug = draft?.slug?.current || "";

          // Patch the document with computed fields
          patch.execute([
            {
              set: {
                countrySlug: countryData.countrySlug,
                fullSlug: `/${countryData.countrySlug}/${subSlug}`,
              },
            },
          ]);

          // Small delay to ensure patch completes
          // await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Now publish
      publish.execute();
    },
  };
};

// Export as plugin
export const autoPopulateRegionPlugin = definePlugin({
  name: "auto-populate-Region-fields",
  document: {
    actions: (prev, context) => {
      // Replace the default publish action for Regions
      if (context.schemaType === "regions") {
        return prev.map((action) =>
          action.action === "publish" ? AutoPopulateRegionFieldsAction : action,
        );
      }
      return prev;
    },
  },
});
