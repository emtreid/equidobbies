"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { MapTack } from "../types/MapTack";
import styles from "./Map.module.css";

import { dobbies } from "../data/dobbies";

const containerStyle = {
  width: "400px",
  height: "400px",
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [newMarker, setNewMarker] = useState<MapTack>({
    name: "New Location",
    lat: 0,
    lng: 0,
  });

  const [markers, setMarkers] = useState<MapTack[]>([]);

  const [markerIsDirty, setMarkerIsDirty] = useState<boolean>(false);

  const allMarkers = markerIsDirty ? [...markers, newMarker] : markers;

  const [equiDobbies, setEquiDobbies] = useState<{ mapTack: MapTack, distance: number } | null>(null);

  const [center, setCenter] = useState({
    lat: 53.797,
    lng: -1.547,
  });

  const allMarkersForMap = equiDobbies ? [...allMarkers.map((marker, index) => (
    <Marker key={index} position={marker} />
  )), <Marker key="equidobbies" position={equiDobbies.mapTack} label={"Dobbies " + equiDobbies.mapTack.name} />]
    : allMarkers.map((marker, index) => (
      <Marker key={index} position={marker} />
    ));

  const findEquidobbies = useCallback(() => {
    const markerCentreLat = allMarkers.reduce((sum, marker) => sum + marker.lat, 0) / allMarkers.length;
    const markerCentreLng = allMarkers.reduce((sum, marker) => sum + marker.lng, 0) / allMarkers.length;
    const closestEquiDobbies = dobbies.map((dobby) => {
      const distanceSq =
        Math.pow(dobby.lat - markerCentreLat, 2) +
        Math.pow(dobby.lng - markerCentreLng, 2);
      return { ...dobby, distance: distanceSq };
    }
    ).sort((a, b) => a.distance - b.distance)[0];

    const equidobby = { mapTack: { name: closestEquiDobbies.name, lat: closestEquiDobbies.lat, lng: closestEquiDobbies.lng }, distance: Math.sqrt(closestEquiDobbies.distance) };
    setEquiDobbies(equidobby);
    setCenter(equidobby.mapTack);
  }, [allMarkers]);


  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      setMarkerIsDirty(true);
      if (event.latLng) {
        const updatedMarker = {
          ...newMarker,
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setNewMarker(updatedMarker);
      }
    },
    [newMarker]
  );

  const resetUnsavedMarker = useCallback(() => {
    setMarkerIsDirty(false);
    setNewMarker({
      name: "New Location",
      lat: 0,
      lng: 0,
    });
  }, []);

  const onSaveMarker = useCallback(() => {
    if (markerIsDirty) {
      setMarkers((current) => [...current, newMarker]);
      resetUnsavedMarker();
    }
  }, [markerIsDirty, newMarker, resetUnsavedMarker]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMarker({ ...newMarker, name: e.target.value });
  };

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    mapRef.current = null;
  }, []);

  return isLoaded ? (
    <div>
      {equiDobbies &&
        <div>
          < h3 > EquiDobby: {equiDobbies.mapTack.name}</h3>
          <h3>Average distance: {equiDobbies.distance.toFixed(3)}</h3>
        </div >}
      {!equiDobbies &&
        <button onClick={findEquidobbies} className={styles.dobbiesButton}>
          Find my EquiDobbies
        </button>}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={onMapClick}
        onUnmount={onUnmount}
      >
        {allMarkersForMap}
      </GoogleMap>
      <div>
        <h2>Selected Locations</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li key="unsaved" className={styles.pill}>
            <input
              type="text"
              value={newMarker.name}
              onChange={handleNameChange}
              className={styles.input}
            />
            <span className={styles.coords}>
              Lat: {newMarker.lat.toFixed(3)}
            </span>
            <span className={styles.coords}>
              Lng: {newMarker.lng.toFixed(3)}
            </span>
            <button onClick={onSaveMarker} className={styles.button}>
              Save
            </button>
          </li>

          {markers.map((marker, index) => (
            <li key={index} className={styles.pill}>
              <span>{marker.name}</span>
              <span className={styles.coords}>
                Lat: {marker.lat.toFixed(3)}
              </span>
              <span className={styles.coords}>
                Lng: {marker.lng.toFixed(3)}
              </span>
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
