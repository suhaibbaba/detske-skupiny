import { Skeleton } from "@mui/material";

/**
 * A placeholder occupying exactly the box the map will.
 *
 * The style is copied from `MapComponent`'s own container rather than
 * approximated: same `minHeight`, same `height: 100%`. Every call site already
 * wraps the map in a fixed-height parent, so matching the inner element is
 * what keeps the swap invisible - the catalog's 0.30 CLS was the map arriving
 * into a container with no reserved height, and a skeleton of a different size
 * would only move the shift rather than remove it.
 *
 * Lives with the other skeletons so the four of them share one look; it is the
 * one they were aligned to, because it is the one that was already measured
 * against a real component.
 */
const MapSkeleton = ({ minHeight = 400 }: { minHeight?: number }) => (
  <Skeleton
    variant="rectangular"
    // `aria-hidden` because there is nothing here to announce yet; the map
    // itself carries whatever semantics it has once it mounts.
    aria-hidden
    sx={{
      minHeight: `${minHeight}px`,
      height: "100%",
      width: "100%",
      borderRadius: "12px",
    }}
  />
);

export default MapSkeleton;
