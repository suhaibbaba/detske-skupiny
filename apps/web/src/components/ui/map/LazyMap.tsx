"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@mui/material";
import type { MapProps } from "@/components/ui/map/MapComponent";

/**
 * The map, fetched only when a page actually renders one.
 *
 * MapLibre GL and the MapTiler SDK are 1.28 MB of JavaScript before
 * compression - by a wide margin the largest thing the site ships. Importing
 * `MapComponent` statically put all of it in the first-load bundle of every
 * page that could reach it, which was not only the catalog and the school
 * detail page but also the home page and the cooperation page: both render
 * `<Zone>`, and `sanity/sections/registry.ts` statically imports every section
 * component including `MapCollection`. Cooperation does not even show a map.
 *
 * `ssr: false` is deliberate rather than incidental. The map is a canvas that
 * measures its own container and then talks to a tile server; it renders
 * nothing useful on the server, and MapLibre reaches for `window` on import.
 * Skipping it server-side also keeps it out of the streamed HTML.
 *
 * `next/dynamic` with `ssr: false` is only legal inside a Client Component,
 * which is why this file carries the directive and the three map call sites
 * import this instead of `MapComponent`. Two of them (`SchoolMap`,
 * `SchoolsMap`) are Server Components and stay that way - what they import is
 * a client boundary, not client code of their own.
 */

/**
 * A placeholder occupying exactly the box the map will.
 *
 * The style is copied from `MapComponent`'s own container rather than
 * approximated: same `minHeight`, same `height: 100%`. Every call site already
 * wraps the map in a fixed-height parent, so matching the inner element is
 * what keeps the swap invisible - the catalog's 0.30 CLS was the map arriving
 * into a container with no reserved height, and a skeleton of a different size
 * would only move the shift rather than remove it.
 */
const MapSkeleton = ({ minHeight = 400 }: { minHeight?: number }) => (
  <Skeleton
    variant="rectangular"
    animation="wave"
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

const LazyMap = dynamic(() => import("@/components/ui/map/MapComponent"), {
  ssr: false,
});

/**
 * The fallback comes from a `Suspense` boundary rather than `next/dynamic`'s
 * own `loading` option, because `loading` is rendered with no props: it would
 * always claim the default 400px while the school detail map asks for 426.
 * Sizing the placeholder from the same prop the map will use is the whole
 * point of the placeholder.
 */
const Map = (props: MapProps) => (
  <Suspense fallback={<MapSkeleton minHeight={props.minHeight} />}>
    <LazyMap {...props} />
  </Suspense>
);

export default Map;
export { MapSkeleton };
