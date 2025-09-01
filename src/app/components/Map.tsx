"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 53.8008,
  lng: 1.5491,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarkers((current) => [
        ...current,
        {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng(),
        },
      ]);
    }
  }, []);

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
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <div>
        <h2>Selected Locations</h2>
        <ul>
          {markers.map((marker, index) => (
            <li key={index}>
              Marker {index + 1}: Lat: {marker.lat}, Lng: {marker.lng}
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
