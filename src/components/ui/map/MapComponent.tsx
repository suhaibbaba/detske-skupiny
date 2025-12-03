"use client";

import React, { useEffect, useState, useRef } from "react";
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
  const markersRef = useRef<globalThis.Map<string, maptilersdk.Marker>>(
    new globalThis.Map()
  );

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

    // Close Popup when click outside
    map.current.on("click", () => {
      closeCurrentPopup();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [defaultCenter, defaultZoom]);

  // Function to close current popup
  const closeCurrentPopup = () => {
    if (popupRef.current && map.current) {
      popupRef.current.remove();
      setActivePopup(null);
    }
  };

  // Function to show popup for a marker
  const showPopupForMarker = (markerData: MarkerData) => {
    if (!popupRef.current || !popupContainerRef.current || !map.current) return;

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
  };

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();
    closeCurrentPopup();

    // Add new markers
    filteredMarkers.forEach((markerData) => {
      if (!markerData.coordinate) return;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.0003 9.89899C11.2276 9.89899 12.2225 8.97778 12.2225 7.84141C12.2225 6.70505 11.2276 5.78384 10.0003 5.78384C8.77302 5.78384 7.7781 6.70505 7.7781 7.84141C7.7781 8.97778 8.77302 9.89899 10.0003 9.89899Z" fill="#9980B0"/>
          <path d="M10.0003 0C7.79091 0.00217861 5.67267 0.815801 4.11038 2.26234C2.54809 3.70888 1.66936 5.67019 1.66701 7.7159C1.66364 9.36627 2.23787 10.9732 3.30367 12.2961C3.32381 12.3285 3.34608 12.3598 3.37034 12.3897L9.11143 19.583C9.21475 19.7123 9.34939 19.8174 9.50454 19.8898C9.65968 19.9623 9.83101 20 10.0048 20C10.1785 20 10.3498 19.9623 10.505 19.8898C10.6601 19.8174 10.7948 19.7123 10.8981 19.583L16.6347 12.3897C16.659 12.3601 16.6813 12.3292 16.7014 12.2971C17.7656 10.9734 18.3383 9.36612 18.3336 7.7159C18.3313 5.67019 17.4526 3.70888 15.8903 2.26234C14.328 0.815801 12.2097 0.00217861 10.0003 0ZM10.0003 11.9566C9.12129 11.9566 8.26201 11.7152 7.53112 11.263C6.80024 10.8109 6.23059 10.1682 5.8942 9.41621C5.55781 8.66427 5.46979 7.83685 5.64128 7.03859C5.81277 6.24033 6.23606 5.50708 6.85763 4.93157C7.47919 4.35605 8.27112 3.96412 9.13325 3.80534C9.99539 3.64655 10.889 3.72805 11.7011 4.03951C12.5132 4.35098 13.2074 4.87843 13.6957 5.55516C14.1841 6.23189 14.4448 7.02751 14.4448 7.84141C14.4448 8.93282 13.9765 9.97952 13.143 10.7513C12.3095 11.523 11.1791 11.9566 10.0003 11.9566Z" fill="#9980B0"/>
        </svg>
      `;

      // Create marker
      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([markerData.coordinate.lng, markerData.coordinate.lat])
        .addTo(map.current!);

      // Handle marker click
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showPopupForMarker(markerData);
      });

      markersRef.current.set(markerData.id, marker);
    });
  }, [filteredMarkers, onMarkerClick]);

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
