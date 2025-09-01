"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { MapTack } from "../types/MapTack";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 53.797,
  lng: -1.547,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [newMarker, setNewMarker] = useState<MapTack>({
    name: "New Location",
    lat: center.lat,
    lng: center.lng,
  });

  const [markers, setMarkers] = useState<MapTack[]>([]);

  const [showUnsavedMarker, setShowUnsavedMarker] = useState<boolean>(false);

  const allMarkers = showUnsavedMarker ? [...markers, newMarker] : markers;


  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    setShowUnsavedMarker(true);
    if (event.latLng) {
      const updatedMarker = {
        ...newMarker,
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      setNewMarker(updatedMarker);
    }
  }, []);

  const resetUnsavedMarker = useCallback(() => {
    setShowUnsavedMarker(false);
    setNewMarker({
      name: "New Location",
      lat: center.lat,
      lng: center.lng,
    });
  }, []);

  const onSaveMarker = useCallback(() => {
    if (showUnsavedMarker) {
      setMarkers((current) => [...current, newMarker]);
      resetUnsavedMarker();
    }
  }, [markers, newMarker]);

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    mapRef.current = null;
  }, []);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={onMapClick}
        onUnmount={onUnmount}
      >
        {allMarkers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <div>
        <h2>Selected Locations</h2>
        <ul>
          <li key="unsaved">
            {newMarker.name} Lat: ${newMarker.lat.toFixed(3)}, Lng: ${newMarker.lng.toFixed(3)}`
          </li>
          {markers.map((marker, index) => (
            <li key={index}>
              {marker.name} Lat: {marker.lat.toFixed(3)}, Lng: {marker.lng.toFixed(3)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
