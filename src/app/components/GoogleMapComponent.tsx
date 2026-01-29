/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { aviraMapStyle } from "@/lib/mapStyles";

interface GoogleMapComponentProps {
  lat?: number;
  lng?: number;
  address?: string;
  height?: string;
}

export default function GoogleMapComponent({
  lat,
  lng,
  address,
  height = "350px",
}: GoogleMapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey as string,
    libraries: ["places"],
  });

  const [center, setCenter] = useState({
    lat: lat || 6.5244,
    lng: lng || 3.3792,
  });

  const [autocomplete, setAutocomplete] = useState<any>(null);

  const containerStyle = {
    width: "100%",
    height,
    borderRadius: "12px",
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        setCenter({ lat: newLat, lng: newLng });
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center p-8 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
        Google Maps API Key missing. Please check your .env file.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-8 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-sm">
        Error loading Google Maps: {loadError.message}
      </div>
    );
  }

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <>
      {!address && (
        <div className="flex flex-col gap-2 mb-4">
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for a place..."
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#00b894] outline-none"
            />
          </Autocomplete>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          styles: aviraMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={center}
          icon={{
            url: "/avira-pin.svg",
          }}
        />
      </GoogleMap>
    </>
  );
}
