"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import type { SxProps, Theme } from "@mui/material/styles";
import useTranslate from "@/hooks/useTranslate";
import {
  hasPosition,
  type MapCoordinate,
  type MarkerData,
  type PositionedMarker,
} from "@/types";
import "@/components/map/styles.css";
import PopupContent from "@/components/map/PopupContent";

/**
 * One GeoJSON point handed to the MapTiler source.
 *
 * The array is built here and read straight back by `source.setData`, so the
 * shape is fully known - and `clusterCenter` below needs it to read a cluster's
 * position back out of a rendered feature.
 */
type MarkerFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    id: string;
    name: string | null;
    count: number;
    overlapping?: boolean;
  };
};

/**
 * The position of a rendered cluster.
 *
 * `queryRenderedFeatures` types `geometry` as the whole GeoJSON geometry
 * union, and only a Point carries a `[lng, lat]` pair. The clusters layer only
 * ever renders points, so anything else falls back to the map's current
 * centre rather than easing to a coordinate read off the wrong shape.
 */
const clusterCenter = (feature: {
  geometry: { type: string; coordinates?: unknown };
}): [number, number] | undefined => {
  const { geometry } = feature;
  if (geometry.type !== "Point" || !Array.isArray(geometry.coordinates)) {
    return undefined;
  }
  const [lng, lat] = geometry.coordinates;
  return typeof lng === "number" && typeof lat === "number"
    ? [lng, lat]
    : undefined;
};

const styles = {
  /**
   * Sits over the canvas rather than replacing it: the MapTiler instance has
   * to keep its container, and unmounting it to show a message would tear the
   * whole map down and rebuild it the moment a filter matched again.
   */
  emptyOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 3,
    // Above MapTiler's own canvas and controls, below the popup.
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    pointerEvents: "none",
  },
  emptyMessage: {
    maxWidth: 420,
    textAlign: "center",
    fontWeight: 600,
    color: "custom.textHeading",
  },
} satisfies Record<string, SxProps<Theme>>;

export interface MapProps {
  selectedRegionId?: string;
  defaultCenter?: MapCoordinate;
  markers?: MarkerData[];
  defaultZoom?: number;
  onMarkerClick?: (marker: PositionedMarker) => void;
  minHeight?: number;
}

const MapComponent: React.FC<MapProps> = ({
  selectedRegionId,
  markers = [],
  defaultCenter = { lat: 0, lng: 0 },
  defaultZoom = 9,
  onMarkerClick,
  minHeight = 400,
}) => {
  const translate = useTranslate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markersMapRef = useRef<Map<string, PositionedMarker>>(new Map());

  // State for popup management
  const [activePopup, setActivePopup] = useState<{
    markerData: PositionedMarker;
    container: HTMLDivElement;
  } | null>(null);

  const popupRef = useRef<maptilersdk.Popup | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * The markers this map will actually draw.
   *
   * `hasPosition` drops schools whose address carries no map location; reading
   * `coordinate.lng` off one of those throws.
   *
   * Derived with `useMemo` rather than an effect writing to state. An effect
   * would be one render behind, so a map would render once with an empty list
   * before it ran - which the empty message below would read as "no results"
   * and flash on every mount, including the ones about to draw markers.
   */
  const filteredMarkers = useMemo<PositionedMarker[]>(() => {
    const filtered = selectedRegionId
      ? markers.filter((marker) => marker.selectedRegionId === selectedRegionId)
      : markers;

    return filtered.filter(hasPosition);
  }, [markers, selectedRegionId]);

  /**
   * True when there is nothing to draw but something was asked for.
   *
   * Distinguishes "this filter combination has no places in it", which is
   * worth saying, from "this map has not been given any markers", which is
   * either a page that draws an empty map on purpose or a bug - and in neither
   * case does an editor-facing message help.
   */
  const hasNoResults = markers.length > 0 && filteredMarkers.length === 0;

  // Function to close current popup
  const closeCurrentPopup = useCallback(() => {
    if (popupRef.current && map.current) {
      popupRef.current.remove();
      setActivePopup(null);
    }
  }, []);

  // Function to show popup for a marker
  const showPopupForMarker = useCallback(
    (markerData: PositionedMarker) => {
      if (!popupRef.current || !popupContainerRef.current || !map.current)
        return;

      // Set active popup state (this will trigger portal render)
      setActivePopup({
        markerData,
        container: popupContainerRef.current,
      });

      // Position and show the popup
      popupRef.current.setLngLat([
        markerData.coordinate.lng,
        markerData.coordinate.lat,
      ]);
      popupRef.current.addTo(map.current);

      // Call callback
      onMarkerClick?.(markerData);
    },
    [onMarkerClick],
  );

  /**
   * Escape closes the popup.
   *
   * The popup is a panel that opens over the content and traps nothing, so
   * WCAG 2.1.2 wants a keyboard way out of it. Its other two exits - a click on
   * the map background and its own close button - both need a pointer.
   *
   * Bound on `document` rather than on the popup, because the popup is
   * portalled into MapTiler's own DOM and focus may well be somewhere else on
   * the page by the time the user reaches for Escape.
   */
  useEffect(() => {
    if (!activePopup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCurrentPopup();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activePopup, closeCurrentPopup]);

  // Initialize map
  useEffect(() => {
    const center = defaultCenter || { lat: 0, lng: 0 };

    if (map.current || !mapContainer.current) {
      return;
    }

    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "";

    if (!maptilersdk.config.apiKey) {
      console.error(
        "MapTiler API key is missing. Please set NEXT_PUBLIC_MAPTILER_API_KEY in your .env file",
      );
      return;
    }

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center.lng, center.lat],
      zoom: defaultZoom,
    });

    // Create reusable popup container
    popupContainerRef.current = document.createElement("div");

    // Create reusable popup
    popupRef.current = new maptilersdk.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      maxWidth: "none",
      className: "custom-popup",
    });
    popupRef.current.setDOMContent(popupContainerRef.current);

    // Wait for map to load before adding sources and layers
    map.current.on("load", () => {
      if (!map.current) return;

      // Add a GeoJSON source for markers with clustering enabled
      map.current.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points
      });

      // Add layer for clustered points
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          // The brand purple, in step with `primary.main` in theme/palette.ts.
          // It carries the white cluster count, so it is held to 4.5:1 like any
          // other text - see theme/contrast.ts.
          "circle-color": "#886AA3",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, // radius for clusters with < 10 points
            10,
            30, // radius for clusters with 10-99 points
            100,
            40, // radius for clusters with 100+ points
          ],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        },
      });

      // Add layer for cluster count labels
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          /*
           * Fonts MapTiler actually serves.
           *
           * "DIN Offc Pro Medium" is a Mapbox glyph set, not a MapTiler one,
           * so the first entry always missed and the label fell through to
           * whatever the style happened to have - which is why cluster counts
           * rendered in a different face from the rest of the site and could
           * change between loads.
           */
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add layer for unclustered points (individual markers)
      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#886AA3",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Handle cluster clicks - zoom in
      map.current.on("click", "clusters", async (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        const source = map.current.getSource(
          "markers",
        ) as maptilersdk.GeoJSONSource;

        try {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          if (!map.current) return;

          map.current.easeTo({
            center: clusterCenter(features[0]),
            zoom: zoom,
          });
        } catch (err) {
          console.error("Error getting cluster expansion zoom:", err);
        }
      });

      // Handle unclustered point clicks - show popup
      map.current.on("click", "unclustered-point", (e) => {
        if (!e.features || !e.features[0].properties) return;

        const markerId = e.features[0].properties.id;
        const markerData = markersMapRef.current.get(markerId);

        if (markerData) {
          showPopupForMarker(markerData);
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "unclustered-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "unclustered-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });

    // Close Popup when click on map (not on markers)
    map.current.on("click", (e) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: ["clusters", "unclustered-point"],
      });

      if (!features || features.length === 0) {
        closeCurrentPopup();
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [defaultCenter, defaultZoom, closeCurrentPopup, showPopupForMarker]);

  // Update markers
  useEffect(() => {
    if (!map.current) {
      console.log("Map not initialized yet");
      return;
    }

    // Wait for the map to be loaded before updating markers
    const updateMarkers = () => {
      const source = map.current?.getSource(
        "markers",
      ) as maptilersdk.GeoJSONSource;
      if (!source) {
        console.log("Source not ready yet");
        return;
      }

      closeCurrentPopup();

      // Clear markers map and rebuild
      markersMapRef.current.clear();

      // Group markers by coordinates to handle overlapping
      const coordMap = new Map<string, PositionedMarker[]>();
      filteredMarkers.forEach((m) => {
        const key = `${m.coordinate.lng.toFixed(6)},${m.coordinate.lat.toFixed(6)}`;
        const existing = coordMap.get(key) || [];
        coordMap.set(key, [...existing, m]);
      });

      // Convert markers to GeoJSON features with offset for overlapping markers
      const features: MarkerFeature[] = [];

      coordMap.forEach((markersAtLocation, coordKey) => {
        if (markersAtLocation.length === 1) {
          // Single marker - no offset needed
          const m = markersAtLocation[0];
          markersMapRef.current.set(m.id, m);

          features.push({
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [m.coordinate.lng, m.coordinate.lat],
            },
            properties: {
              id: m.id,
              name: m.name,
              count: 1,
            },
          });
        } else {
          // Multiple markers - apply circular offset pattern
          const offsetDistance = 0.0003; // ~30 meters
          markersAtLocation.forEach((m, index) => {
            markersMapRef.current.set(m.id, m);

            // Calculate offset in a circular pattern
            const angle = (index * 2 * Math.PI) / markersAtLocation.length;
            const offsetLng = Math.cos(angle) * offsetDistance;
            const offsetLat = Math.sin(angle) * offsetDistance;

            features.push({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [
                  m.coordinate.lng + offsetLng,
                  m.coordinate.lat + offsetLat,
                ],
              },
              properties: {
                id: m.id,
                name: m.name,
                count: markersAtLocation.length,
                overlapping: true,
              },
            });
          });
        }
      });

      // Update the GeoJSON source with new data
      source.setData({
        type: "FeatureCollection",
        features: features,
      });
    };

    // If map is already loaded, update immediately
    if (map.current.loaded()) {
      updateMarkers();
    } else {
      // Otherwise wait for load event
      map.current.once("load", updateMarkers);
    }
  }, [filteredMarkers, closeCurrentPopup, markers]);

  return (
    /*
     * A labelled region, not a bare div.
     *
     * A map is a single interactive widget the size of a page section, and
     * with no role and no name a screen reader reads it as an unlabelled block
     * of canvas - there is no way to tell it apart from the rest of the page,
     * or to jump past it. `role="region"` with a name puts it in the landmark
     * list, so it can be both found and skipped.
     */
    <Box
      role="region"
      aria-label={translate("mapRegionLabel")}
      sx={{ position: "relative", height: "100%" }}
    >
      {/*
       * The accessible alternative, named.
       *
       * There is no way to make a clustered vector map usable without sight,
       * and the honest answer is not to pretend otherwise: the school list on
       * this page carries every place the map draws, with the same name and
       * address, in a form that reads and tabs. WCAG 1.1.1 is satisfied by
       * that equivalent, not by an alt text on a canvas - but only if someone
       * is told the list is there, which is what this sentence does.
       */}
      <Box sx={visuallyHidden}>{translate("mapListAlternative")}</Box>

      <div
        ref={mapContainer}
        style={{ minHeight: `${minHeight}px`, height: "100%" }}
      />

      {/*
       * Zero markers is a state, not a blank canvas.
       *
       * Without this, narrowing the filters until nothing matches leaves the
       * map drawing streets and nothing else, which reads as "the map is
       * broken" rather than "there is nothing here". `aria-live` because it
       * appears in response to a filter change the user made somewhere else
       * on the page, with no navigation to announce it.
       */}
      {hasNoResults && (
        <Box role="status" aria-live="polite" sx={styles.emptyOverlay}>
          <Typography sx={styles.emptyMessage}>
            {translate("mapNoResults")}
          </Typography>
        </Box>
      )}

      {/* Portal for popup content - stays within React tree */}
      {activePopup &&
        createPortal(
          <PopupContent
            markerData={activePopup.markerData}
            onClose={closeCurrentPopup}
          />,
          activePopup.container,
        )}
    </Box>
  );
};

export default MapComponent;
