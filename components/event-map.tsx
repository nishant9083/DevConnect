"use client";
// import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUserLocation } from "@/utils/get_location";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

// Create map icons
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const orig_icon = L.icon({
  iconUrl: "/original_loc.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Define Location type
interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  marker?: {
    position: Location;
    popup?: string;
  };
  onLocationSelect?: (location: Location) => void;
  height?: string;
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect?: (location: Location) => void;
}) {
  const [position, setPosition] = useState<Location | null>(null);
  const map = useMap();

  useEffect(() => {
    // Only set up click event once for map
    const onClickHandler = (e: any) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationSelect?.({ lat, lng });
    };

    map.on("click", onClickHandler);

    return () => {
      map.off("click", onClickHandler);
    };
  }, [map, onLocationSelect]);

  return (
    <>
      {position !== null && (
        <Marker position={position} icon={icon}>
          <Popup>Selected location</Popup>
        </Marker>
      )}
    </>
  );
}

export function EventMap({
  marker,
  onLocationSelect,
  height = "400px",
}: MapProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Fetch user location if no marker is provided
    if (!marker) {
      getUserLocation()
        .then((location) => {
          console.log("User location:", location);
          setUserLocation(location);
        })
        .catch((error) => {
          console.error("Error getting location:", error);
          setUserLocation({ lat: 51.505, lng: -0.09 }); // Default fallback location
        });
    } else {
      setUserLocation(marker.position);
    }

    return () => {
      setUserLocation(null); // Cleanup when component unmounts
    };
  }, []); // Only rerun if marker changes

  return (
    <div style={{ height, width: "100%" }} className="rounded-lg border">
      {!userLocation ? (
        <MapSkeleton />
      ) : (
        <MapContainer
          center={userLocation!}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg" 
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marker && (
            <Marker position={marker.position} icon={orig_icon}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          )}
          {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}
        </MapContainer>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton className="h-96" />
      </CardContent>
    </Card>
  );
}
