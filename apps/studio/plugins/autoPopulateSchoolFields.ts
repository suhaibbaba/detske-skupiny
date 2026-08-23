import { definePlugin } from "sanity";
import {
  DocumentActionComponent,
  useDocumentOperation,
  useClient,
} from "sanity";
import { Address } from "@/types/school";
import { getGeoLocation, getGeoLocationBatch } from "@/utility/geoLocation";
import { removeDiacritics } from "@/utility";

type SchoolDocument = {
  _id: string;
  _type: string;
  name: string;
  area?: {
    _ref: string;
  };
  slug?: {
    current: string;
  };
  countrySlug?: string;
  regionSlug?: string;
  fullSlug?: string;
  address?: Address;
  types?: {
    _ref: string;
  }[];
  isHighPriority?: boolean;
};

// This action runs whenever a School document is published
const AutoPopulateSchoolFieldsAction: DocumentActionComponent = (props) => {
  const { publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "",
  });
  const draft = props.draft as SchoolDocument | null;
  const draftId = draft?._id || `drafts.${props.id}`;

  return {
    label: "Publish",
    onHandle: async () => {
      // Only run for Areas
      if (props.type !== "schools") {
        publish.execute();
        return;
      }

      // Get the area reference
      const areaRef = draft?.area?._ref;
      let path: { [key: string]: string | object | boolean } = {
        nameNormalized: removeDiacritics(draft?.name || ""),
      };

      if (areaRef) {
        // Fetch the referenced data
        const areaData = await client.fetch(
          `*[_id == $areaRef][0]{
              "regionSlug": region->slug.current,
              "countrySlug": region->country->slug.current
          }`,
          { areaRef },
        );

        if (areaData) {
          path = {
            ...path,
            countrySlug: areaData.countrySlug,
            regionSlug: areaData.regionSlug,
          };
        }
      }

      // Add address
      const addressModel = draft?.address;

      if (!addressModel?.mapLocation?.lat || !addressModel?.mapLocation?.lng) {
        const result = await getGeoLocation(draft?.address);
        if (result) {
          path = {
            ...path,
            "address.mapLocation": {
              _type: "geopoint",
              lat: result.lat,
              lng: result.lng,
            },
          };
        }
      }

      /**
       * Determine if the school is high priority
       */
      if (draft?.types && draft.types.length > 0) {
        const typeRefs = draft.types.map((type) => type._ref);

        // Fetch all referenced type documents
        const typeData = await client.fetch<{ highPriority?: boolean }[]>(
          `*[_id in $typeRefs]{
            highPriority
          }`,
          { typeRefs },
        );

        // Check if any type has isHighPriority set to true
        const hasHighPriorityType =
          typeData?.some((type) => type.highPriority) || false;
        path = {
          ...path,
          isHighPriority: hasHighPriorityType,
        };
      }

      // Patch the draft with the computed fields and wait for the commit to
      // land before publishing, so the published document always includes them.
      await client.patch(draftId).set(path).commit();

      // Now publish
      publish.execute();
    },
  };
};

// Export as plugin
export const autoPopulateSchoolPlugin = definePlugin({
  name: "auto-populate-School-fields",
  document: {
    actions: (prev, context) => {
      // Replace the default publish action for Areas
      if (context.schemaType === "schools") {
        return prev.map((action) =>
          action.action === "publish" ? AutoPopulateSchoolFieldsAction : action,
        );
      }
      return prev;
    },
  },
});
