"use client";

import React, { useEffect, useState, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { createRoot } from "react-dom/client";
import { MapCoordinate, MarkerData } from "@/sanity/types";
import "@/components/ui/map/syles.css";
import PopupContent from "@/components/ui/map/PopupContent";

export interface MapProps {
  regionId?: string;
  defaultCenter?: MapCoordinate;
  markers?: MarkerData[];
  defaultZoom?: number;
  onMarkerClick?: (marker: MarkerData) => void;
}

const MapComponent: React.FC<MapProps> = ({
  regionId,
  markers = [],
  defaultCenter = { lat: 0, lng: 0 },
  defaultZoom = 9,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const markersRef = useRef<globalThis.Map<string, maptilersdk.Marker>>(
    new globalThis.Map(),
  );
  const currentPopupRef = useRef<maptilersdk.Popup | null>(null);
  const popupRootsRef = useRef<globalThis.Map<string, any>>(
    new globalThis.Map(),
  );

  // Filter markers based on regionId
  useEffect(() => {
    const filtered = regionId
      ? markers.filter((marker) => marker.selectedRegionId === regionId)
      : markers;

    setFilteredMarkers(filtered);
  }, [markers, regionId]);

  // Initialize map
  useEffect(() => {
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
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: defaultZoom,
    });

    return () => {
      popupRootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          console.error("Error unmounting popup root:", e);
        }
      });
      popupRootsRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [defaultCenter.lat, defaultCenter.lng, defaultZoom]);

  // Function to close current popup
  const closeCurrentPopup = () => {
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }
  };

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers and popups
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();
    closeCurrentPopup();
    popupRootsRef.current.forEach((root) => {
      try {
        root.unmount();
      } catch (e) {
        console.error("Error unmounting popup root:", e);
      }
    });
    popupRootsRef.current.clear();

    // Add new markers
    filteredMarkers.forEach((markerData) => {
      if (!markerData.coordinate) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "25px";
      el.style.height = "36px";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <svg width="25" height="36" viewBox="0 0 36 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.2847 43.8667C17.4333 44.1704 17.9051 44.1748 18.0429 43.8667C20.4555 39.3517 23.4368 35.7669 26.0732 32.6049C30.3039 27.5298 33.9745 23.1353 33.9745 16.7246C33.9702 7.45131 26.7195 -0.0192636 17.6635 3.73152e-05C8.78011 3.73152e-05 1.61945 7.15187 1.36137 16.2851C1.17181 23.3503 4.92863 27.7366 9.27973 32.82C11.9163 35.8874 14.898 39.369 17.2847 43.8667ZM6.89302 13.5278L17.0431 8.22864C17.4309 8.02185 17.8962 8.02185 18.2839 8.22864L28.434 13.5278C29.1405 13.8617 29.3732 14.8246 28.9338 15.4493V20.2315C28.9079 21.3645 27.2342 21.3645 27.2105 20.2315V16.3971L25.4786 17.0865V20.3004C25.5216 21.483 24.0913 22.2693 23.1263 21.5929C22.4111 21.1362 21.1358 20.5503 19.1541 20.3435C17.112 20.0075 13.3252 20.6559 12.2008 21.5929C11.9509 21.7566 11.6665 21.8428 11.3736 21.8428C10.555 21.8579 9.82906 21.1341 9.84847 20.3004V17.0865L7.01366 15.9577C5.97537 15.585 5.87413 14.0017 6.89302 13.5278Z" fill="#F71F1F"/>
          <path d="M17.664 13.4686C21.283 13.4686 23.6782 14.8386 24.678 15.5538L26.901 14.6662L17.6641 9.84961L8.42725 14.6662L10.6503 15.5538C11.6498 14.8386 14.0449 13.4686 17.664 13.4686Z" fill="#F71F1F"/>
          <path d="M25.1173 36.4902C23.0601 39.0623 21.2355 41.574 19.5685 44.676C18.8189 46.1775 16.5032 46.1796 15.7601 44.676C14.0841 41.5332 12.2381 39.0517 10.1418 36.4991C3.97214 37.645 0 40.1697 0 43.1165C0 47.2697 7.59135 50.4062 17.6637 50.4062C27.736 50.4062 35.3274 47.2698 35.3274 43.1165C35.3274 40.1611 31.3293 37.6278 25.1166 36.4902H25.1173Z" fill="#F71F1F"/>
          <path d="M11.5718 17.0169V19.9638C14.2924 18.1112 21.037 18.1134 23.7556 19.9638V17.0169C20.7183 14.6172 14.5767 14.6215 11.5718 17.0169Z" fill="#F71F1F"/>
        </svg>
      `;

      // Create popup container
      const popupContainer = document.createElement("div");

      // Create popup with proper configuration
      const popup = new maptilersdk.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        maxWidth: "none",
        className: "custom-popup",
      });

      // Render React component into popup
      const root = createRoot(popupContainer);
      popupRootsRef.current.set(markerData.id, root);

      root.render(
        <PopupContent
          markerData={markerData}
          onClose={() => {
            closeCurrentPopup();
          }}
        />,
      );

      // Set the DOM content after rendering
      popup.setDOMContent(popupContainer);

      // Create marker
      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([markerData.coordinate.lng, markerData.coordinate.lat])
        .addTo(map.current!);

      // Handle marker click - close previous popup before opening new one
      el.addEventListener("click", (e) => {
        e.stopPropagation();

        // Close any existing popup
        closeCurrentPopup();

        // Open new popup
        popup.setLngLat([markerData.coordinate.lng, markerData.coordinate.lat]);
        popup.addTo(map.current!);
        currentPopupRef.current = popup;

        // Call callback
        onMarkerClick?.(markerData);
      });

      markersRef.current.set(markerData.id, marker);
    });
  }, [filteredMarkers, onMarkerClick]);

  return (
    <div ref={mapContainer} style={{ minHeight: "400px", height: "100%" }} />
  );
};

export default MapComponent;
