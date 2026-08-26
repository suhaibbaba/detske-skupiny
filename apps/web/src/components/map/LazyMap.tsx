"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { MapProps } from "@/components/map/MapComponent";
import MapSkeleton from "@/components/ui/skeleton/MapSkeleton";

/**
 * The map, fetched only when a page actually renders one.
 *
 * MapLibre GL and the MapTiler SDK are 1.28 MB of JavaScript before
 * compression - by a wide margin the largest thing the site ships. Importing
 * `MapComponent` statically would put all of it in the first-load bundle of
 * every page that can reach it: not only the catalog and the school detail
 * page but the home and cooperation pages too, since both render `<Zone>` and
 * `sections/registry.ts` statically imports every section component including
 * `MapCollection`. Cooperation does not show a map at all.
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

const LazyMap = dynamic(() => import("@/components/map/MapComponent"), {
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
