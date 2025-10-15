/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

// Dynamically import leaflet components (client only)
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = (useMap as unknown as () => L.Map)();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13, { animate: true });
  }, [coords, map]);
  return null;
}

export default function AviraMapCore() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [L, setL] = useState<any>(null);
  const [AviraIcon, setAviraIcon] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);

      const icon = new leaflet.DivIcon({
        html: `
          <div class="relative flex items-center justify-center group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#00b894" viewBox="0 0 24 24"
              class="w-8 h-8 drop-shadow-md transition-transform duration-300 group-hover:scale-125">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
            </svg>
            <span class="absolute w-6 h-6 rounded-full bg-teal-400 opacity-50 animate-ping"></span>
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      setAviraIcon(icon);
    });
  }, []);

  // if (!L || !AviraIcon) return <p>Loading map...</p>;

  // 🔍 Handle autocomplete
  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    };
    fetchSuggestions();
  }, [search]);

  const handleSelect = (place: any) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setCoords([lat, lon]);
    setSearch(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="w-full h-[600px] relative">
      {/* 🔍 Autocomplete Search */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-96">
        <input
          type="text"
          placeholder="Search for a place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 shadow-lg focus:ring-2 focus:ring-teal-400"
        />
        {suggestions.length > 0 && (
          <ul className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-[1001]">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(s)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🗺️ Map */}
      {!L || !AviraIcon ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading map...
        </div>
      ) : (
        <MapContainer
          center={[9.0765, 7.3986]} // Abuja default
          zoom={6}
          scrollWheelZoom={true}
          className="w-full h-full rounded-xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <FlyToLocation coords={coords} />

          <Marker position={[6.5244, 3.3792]} icon={AviraIcon}>
            <Popup>Lagos, Nigeria 🌴</Popup>
          </Marker>
          <Marker position={[9.0765, 7.3986]} icon={AviraIcon}>
            <Popup>Abuja, Nigeria 🏛️</Popup>
          </Marker>
          <Marker position={[12.0022, 8.5919]} icon={AviraIcon}>
            <Popup>Kano, Nigeria 🕌</Popup>
          </Marker>

          {coords && (
            <Marker position={coords} icon={AviraIcon}>
              <Popup>{search}</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  );
}
