import type {
  GroupPageQueryResult,
  SchoolMarkersQueryResult,
} from "@detske-skupiny/types";

/** A region row, as the group page projects it. */
export type Region = NonNullable<GroupPageQueryResult["regions"]>[number];

/**
 * A map pin.
 *
 * `selectedRegionId` is optional because two queries produce markers and only
 * one projects it: the home page's `mapCollection` section adds
 * `area->region->_id` so the map can filter by region, while the catalog's
 * `schoolMarkersQuery` is already scoped by geography and does not.
 */
export type MarkerData = SchoolMarkersQueryResult[number] & {
  selectedRegionId?: string | null;
};

/**
 * A concrete point.
 *
 * Sanity's `geopoint` has optional `lat` and `lng`, and a school whose address
 * has no map location projects `coordinate: null` - so this is the shape a
 * marker has *after* that has been checked, not the shape it arrives in. The
 * map component narrows to it once, at the point markers enter its state.
 */
export type MapCoordinate = { lat: number; lng: number };

/** A marker whose school actually has a map location. */
export type PositionedMarker = MarkerData & { coordinate: MapCoordinate };

/** Narrows a marker to one the map can place. */
export const hasPosition = (marker: MarkerData): marker is PositionedMarker =>
  typeof marker.coordinate?.lat === "number" &&
  typeof marker.coordinate?.lng === "number";
