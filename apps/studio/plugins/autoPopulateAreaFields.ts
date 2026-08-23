import { definePlugin } from "sanity";
import {
  DocumentActionComponent,
  useDocumentOperation,
  useClient,
} from "sanity";

type AreaDocument = {
  _id: string;
  _type: string;
  region?: {
    _ref: string;
  };
  slug?: {
    current: string;
  };
  countrySlug?: string;
  regionSlug?: string;
  fullSlug?: string;
};

// This action runs whenever a Area document is published
const AutoPopulateAreaFieldsAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const draft = props.draft as AreaDocument | null;

  return {
    label: "Publish",
    onHandle: async () => {
      // Only run for Areas
      if (props.type !== "areas") {
        publish.execute();
        return;
      }

      // Get the area reference
      const regionRef = draft?.region?._ref;

      if (regionRef) {
        // Fetch the referenced data
        const regionData = await client.fetch(
          `*[_id == $regionRef][0]{
              "regionSlug": slug.current,
              "countrySlug": country->slug.current
          }`,
          { regionRef },
        );

        if (regionData) {
          const subSlug = draft?.slug?.current || "";

          // Patch the document with computed fields
          patch.execute([
            {
              set: {
                countrySlug: regionData.countrySlug,
                fullSlug: `/${regionData.countrySlug}/${regionData.regionSlug}/${subSlug}`,
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
export const autoPopulateAreaPlugin = definePlugin({
  name: "auto-populate-Area-fields",
  document: {
    actions: (prev, context) => {
      // Replace the default publish action for Areas
      if (context.schemaType === "areas") {
        return prev.map((action) =>
          action.action === "publish" ? AutoPopulateAreaFieldsAction : action,
        );
      }
      return prev;
    },
  },
});
