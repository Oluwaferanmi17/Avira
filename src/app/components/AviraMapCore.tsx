/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

// --- Types ---
interface AviraMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

// --- Dynamic Imports ---
// We import the entire MapContainer ecosystem dynamically to strictly prevent SSR issues
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false },
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false },
);
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});
// We need to import useMap dynamically or use it inside a component that is only rendered inside MapContainer
const MapController = dynamic(
  async () => {
    const { useMap } = await import("react-leaflet");
    return function MapController({ coords }: { coords: [number, number] }) {
      const map = useMap();
      useEffect(() => {
        if (coords) {
          map.flyTo(coords, 14, { animate: true, duration: 1.5 });
        }
      }, [coords, map]);
      return null;
    };
  },
  { ssr: false },
);

export default function AviraMapCore({ lat, lng, zoom = 13 }: AviraMapProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [resolvedAddress, setResolvedAddress] =
    useState<string>("Loading address...");
  const [addressParts, setAddressParts] = useState<{
    street?: string;
    state?: string;
    country?: string;
  }>({});

  // Default to props coordinates, or fallback to Abuja
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>(
    lat && lng ? [lat, lng] : [9.0765, 7.3986],
  );

  const [customIcon, setCustomIcon] = useState<any>(null);

  // 1. Initialize Leaflet Icon (Client-side only)
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      const icon = new L.DivIcon({
        html: `
          <div class="relative flex items-center justify-center group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#00b894" viewBox="0 0 24 24"
              class="w-10 h-10 drop-shadow-xl transition-transform duration-300 group-hover:scale-110 -mt-8">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
            </svg>
            <span class="absolute w-4 h-4 rounded-full bg-teal-400 opacity-50 animate-ping mt-1"></span>
          </div>
        `,
        className: "bg-transparent",
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Tip of the pin
        popupAnchor: [0, -40],
      });
      setCustomIcon(icon);
    })();
  }, []);

  // 2. Update map if props change (e.g., passing different Stay data)
  useEffect(() => {
    if (lat && lng) {
      setActiveCoords([lat, lng]);
    }
  }, [lat, lng]);

  // 3. Autocomplete Search
  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search,
          )}&addressdetails=1&limit=5`,
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 500); // Debounce API calls

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!activeCoords) return;

    const [lat, lon] = activeCoords;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        );
        const data = await res.json();

        const address = data.address || {};

        setAddressParts({
          street: address.road || address.neighbourhood || address.suburb || "",
          state: address.state || "",
          country: address.country || "",
        });
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setAddressParts({});
      }
    };

    fetchAddress();
  }, [activeCoords]);

  const handleSelectSuggestion = (place: any) => {
    const newLat = parseFloat(place.lat);
    const newLon = parseFloat(place.lon);
    setActiveCoords([newLat, newLon]);
    setSearch(place.display_name.split(",")[0]); // Keep text short
    setSuggestions([]);
  };

  if (!customIcon) {
    return (
      <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {/* 🔍 Autocomplete Search Overlay */}
      <div className="absolute top-3 left-3 right-12 z-400">
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white/90 backdrop-blur-sm px-4 py-2 shadow-md focus:ring-2 focus:ring-teal-500 text-sm outline-none transition-all focus:max-w-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute mt-1 w-full max-w-xs bg-white rounded-lg shadow-xl border border-slate-100 max-h-60 overflow-y-auto overflow-x-hidden">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(s)}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-50 text-slate-700 truncate border-b last:border-0 border-slate-50"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🗺️ Map */}
      <MapContainer
        center={activeCoords || [9.0765, 7.3986]}
        zoom={zoom}
        scrollWheelZoom={false} // Better for page scrolling
        className="w-full h-full rounded-xl z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Helper to fly to new coords */}
        {activeCoords && <MapController coords={activeCoords} />}

        {/* The Main Marker */}
        {activeCoords && (
          <Marker position={activeCoords} icon={customIcon}>
            <Popup className="text-sm text-slate-700 space-y-1">
              <div>
                <strong>Street:</strong> {addressParts.street || "—"}
              </div>
              <div>
                <strong>State:</strong> {addressParts.state || "—"}
              </div>
              <div>
                <strong>Country:</strong> {addressParts.country || "—"}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
