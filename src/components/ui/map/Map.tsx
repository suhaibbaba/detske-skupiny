"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map as MapComponent,
} from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";
import { Coordinate, Coordinates } from "@/sanity/types";
import Marker from "@/components/icons/Marker";

interface Props {
  regionId?: string;
  defaultLocation?: Coordinate;
  coordinates?: Coordinates[];
}

const Map: React.FC<Props> = ({ regionId, coordinates, defaultLocation }) => {
  const [markers, setMarkers] = React.useState<Coordinates[]>([]);

  useEffect(() => {
    const markers = !!regionId
      ? coordinates?.filter((coordinate) => coordinate.regionId === regionId) ||
        []
      : coordinates;

    setMarkers(markers || []);
  }, [coordinates, regionId]);
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}>
      <MapComponent
        defaultCenter={{
          lat: defaultLocation?.lat || 0,
          lng: defaultLocation?.lng || 0,
        }}
        defaultZoom={9}
        mapId="MapCollection"
      >
        {markers.map(({ coordinate }) => (
          <AdvancedMarker
            key={`${coordinate.lat}-${coordinate.lng}`}
            position={{
              lat: coordinate.lat,
              lng: coordinate.lng,
            }}
          >
            <Marker />
          </AdvancedMarker>
        ))}
      </MapComponent>
    </APIProvider>
  );
};

export default Map;
