import {
  definePlugin,
  DocumentActionComponent,
  SanityClient,
  useClient,
  useDocumentOperation,
} from "sanity";
import { useToast } from "@sanity/ui";
import { useState } from "react";
import { removeDiacritics } from "@/utility";
import { getGeoLocation } from "@/utility/geoLocation";
import type { PostalAddress } from "@detske-skupiny/types";

/**
 * The one place the studio writes a computed field.
 *
 * Everything the web app can derive at read time - counts, catalog paths, sort
 * order - it derives, with `count()` subqueries and composed projections. The
 * only fields worth storing are the ones a query genuinely cannot compute:
 *
 *   nameNormalized - GROQ has no diacritics-stripping function, and search
 *                    matches against it
 *   countrySlug    - filtering by a dereferenced path (`area->region->...`) on
 *   regionSlug       every school in the dataset is far slower than an equality
 *                    check on a stored string
 *   isHighPriority - the list ordering reads it, and ordering by a dereferenced
 *                    field is not something GROQ can index
 *   address.mapLocation - the result of an external geocoding call
 *
 * All four are written on publish, for `schools` only, before the publish is
 * executed - so a published school never carries stale values, and drafts are
 * never patched by anything the editor did not do.
 */

type TypeRef = { _ref: string };

type SchoolDraft = {
  _id: string;
  name?: string;
  area?: TypeRef;
  address?: PostalAddress;
  types?: TypeRef[];
};

type ComputeResult = {
  fields: ComputedFields;
  /**
   * Set when geocoding was attempted and failed. The publish still goes ahead
   * without a map pin; the editor is told rather than left guessing.
   */
  geocodingError?: string;
};

type ComputedFields = {
  nameNormalized: string;
  countrySlug?: string;
  regionSlug?: string;
  isHighPriority?: boolean;
  "address.mapLocation"?: {
    _type: "geopoint";
    lat: number;
    lng: number;
  };
};

/**
 * Everything the computed fields need from other documents, in one query.
 *
 * `$areaRef` and `$typeRefs` come from the in-memory draft rather than being
 * re-read here: the draft the editor is looking at is the thing being
 * published, and reading it back would race with its own autosave.
 */
const RELATED_QUERY = `{
  "area": *[_id == $areaRef][0]{
    "regionSlug": region->slug.current,
    "countrySlug": region->country->slug.current
  },
  "types": *[_id in $typeRefs]{ highPriority }
}`;

type RelatedResult = {
  area: { regionSlug?: string; countrySlug?: string } | null;
  types: { highPriority?: boolean }[];
};

/** True when the geocoder should run: either coordinate missing counts. */
function needsGeocoding(address?: PostalAddress) {
  return !address?.mapLocation?.lat || !address?.mapLocation?.lng;
}

export async function computeSchoolFields(
  client: SanityClient,
  draft: SchoolDraft | null,
): Promise<ComputeResult> {
  const fields: ComputedFields = {
    nameNormalized: removeDiacritics(draft?.name || ""),
  };

  const areaRef = draft?.area?._ref ?? null;
  const typeRefs = draft?.types?.map((type) => type._ref) ?? [];

  const related = await client.fetch<RelatedResult>(RELATED_QUERY, {
    areaRef,
    typeRefs,
  });

  if (related?.area) {
    fields.countrySlug = related.area.countrySlug;
    fields.regionSlug = related.area.regionSlug;
  }

  // Ported from autoPopulateSchoolFields: a school is high priority when any
  // of its types is. Only computed when the school has types at all, so a
  // school with none keeps whatever value it already had.
  if (typeRefs.length > 0) {
    fields.isHighPriority =
      related?.types?.some((type) => type.highPriority) || false;
  }

  if (!needsGeocoding(draft?.address)) {
    return { fields };
  }

  // Geocoding is the one step allowed to fail without stopping the publish.
  // MapTiler is a third party, and an editor fixing a typo in a description
  // should not be blocked because someone else's service is down or a key
  // expired. The publish proceeds and the toast says the pin is missing.
  try {
    const coordinates = await getGeoLocation(draft?.address);

    if (coordinates) {
      fields["address.mapLocation"] = {
        _type: "geopoint",
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
    }

    return { fields };
  } catch (error) {
    return {
      fields,
      geocodingError:
        error instanceof Error ? error.message : "Geocoding failed",
    };
  }
}

/**
 * The publish action for schools.
 *
 * The patch is awaited before `publish.execute()`, so the published document
 * always carries the computed fields. If resolving them fails - a bad
 * reference, a rejected patch - the error is shown to the editor and nothing
 * is published, rather than a document going out with fields that silently did
 * not update.
 *
 * Geocoding is the deliberate exception: it calls a third party, so a failure
 * there publishes the school anyway and warns that the map pin is missing.
 */
const PublishSchoolAction: DocumentActionComponent = (props) => {
  const { publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({
    apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION || "2025-08-09",
  });
  const toast = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  const draft = props.draft as SchoolDraft | null;
  const draftId = draft?._id || `drafts.${props.id}`;

  return {
    label: isPublishing ? "Publishing…" : "Publish",
    // `publish.disabled` is what the stock action reads: it covers "nothing to
    // publish" and "no permission".
    disabled: isPublishing || Boolean(publish.disabled),
    onHandle: async () => {
      setIsPublishing(true);

      try {
        const { fields, geocodingError } = await computeSchoolFields(
          client,
          draft,
        );

        await client.patch(draftId).set(fields).commit();

        publish.execute();

        if (geocodingError) {
          toast.push({
            status: "warning",
            title: "Published without map coordinates",
            description: `Could not geocode this address: ${geocodingError}. Fix the address or set the location by hand, then publish again.`,
          });
        }
      } catch (error) {
        toast.push({
          status: "error",
          title: "Could not publish this school",
          description:
            error instanceof Error
              ? error.message
              : "Computing the derived fields failed. Nothing was published.",
        });
        console.error("Failed to compute school fields before publish:", error);
      } finally {
        // Re-enables the button on both paths, so a failed publish can be
        // retried rather than leaving the editor on a dead spinner.
        setIsPublishing(false);
      }
    },
  };
};

export const computedFieldsPlugin = definePlugin({
  name: "computed-fields",
  document: {
    actions: (prev, context) =>
      context.schemaType === "schools"
        ? prev.map((action) =>
            action.action === "publish" ? PublishSchoolAction : action,
          )
        : prev,
  },
});
