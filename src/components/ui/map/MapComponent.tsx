"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { MapCoordinate, MarkerData } from "@/sanity/types";
import "@/components/ui/map/syles.css";
import PopupContent from "@/components/ui/map/PopupContent";

export interface MapProps {
  selectedRegionId?: string;
  defaultCenter?: MapCoordinate;
  markers?: MarkerData[];
  defaultZoom?: number;
  onMarkerClick?: (marker: MarkerData) => void;
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const markersMapRef = useRef<Map<string, MarkerData>>(new Map());

  // State for popup management
  const [activePopup, setActivePopup] = useState<{
    markerData: MarkerData;
    container: HTMLDivElement;
  } | null>(null);

  const popupRef = useRef<maptilersdk.Popup | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter markers based on regionId
  useEffect(() => {
    const filtered = selectedRegionId
      ? markers.filter((marker) => marker.selectedRegionId === selectedRegionId)
      : markers;

    setFilteredMarkers(filtered);
  }, [markers, selectedRegionId]);

  // Function to close current popup
  const closeCurrentPopup = useCallback(() => {
    if (popupRef.current && map.current) {
      popupRef.current.remove();
      setActivePopup(null);
    }
  }, []);

  // Function to show popup for a marker
  const showPopupForMarker = useCallback(
    (markerData: MarkerData) => {
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
    [onMarkerClick]
  );

  // Initialize map
  useEffect(() => {
    const center = defaultCenter || { lat: 0, lng: 0 };

    if (map.current || !mapContainer.current) {
      return;
    }

    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "";

    if (!maptilersdk.config.apiKey) {
      console.error(
        "MapTiler API key is missing. Please set NEXT_PUBLIC_MAPTILER_API_KEY in your .env file"
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
          "circle-color": "#9980B0",
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
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
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
          "circle-color": "#9980B0",
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
          "markers"
        ) as maptilersdk.GeoJSONSource;

        try {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          if (!map.current) return;

          map.current.easeTo({
            center: (features[0].geometry as any).coordinates,
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
        "markers"
      ) as maptilersdk.GeoJSONSource;
      if (!source) {
        console.log("Source not ready yet");
        return;
      }

      closeCurrentPopup();

      // Clear markers map and rebuild
      markersMapRef.current.clear();

      // Group markers by coordinates to handle overlapping
      const coordMap = new Map<string, MarkerData[]>();
      filteredMarkers
        .filter((m) => m.coordinate)
        .forEach((m) => {
          const key = `${m.coordinate.lng.toFixed(6)},${m.coordinate.lat.toFixed(6)}`;
          const existing = coordMap.get(key) || [];
          coordMap.set(key, [...existing, m]);
        });

      // Convert markers to GeoJSON features with offset for overlapping markers
      const features: any[] = [];

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

      console.log("Updating markers:", {
        totalMarkers: markers.length,
        filteredMarkers: filteredMarkers.length,
        features: features.length,
        overlappingLocations: Array.from(coordMap.values()).filter(
          (m) => m.length > 1
        ).length,
        sampleFeature: features[0],
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
    <>
      <div
        ref={mapContainer}
        style={{ minHeight: `${minHeight}px`, height: "100%" }}
      />

      {/* Portal for popup content - stays within React tree */}
      {activePopup &&
        createPortal(
          <PopupContent
            markerData={activePopup.markerData}
            onClose={closeCurrentPopup}
          />,
          activePopup.container
        )}
    </>
  );
};

export default MapComponent;
