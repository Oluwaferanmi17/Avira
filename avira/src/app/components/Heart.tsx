/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface HeartButtonProps {
  itemId: string;
  type: "stay" | "event" | "experience";
  className?: string;
}

export default function HeartButton({
  itemId,
  type,
  className,
}: HeartButtonProps) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Check if already favourited
  useEffect(() => {
    const checkFavourite = async () => {
      try {
        const res = await fetch("/api/favourites");
        if (!res.ok) return;
        const data = await res.json();
        const found = data.some((f: any) => f[`${type}`]?.id === itemId);
        setIsFavourited(found);
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      }
    };
    checkFavourite();
  }, [itemId, type]);

  // ✅ Toggle Add/Remove
  const toggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, type }),
      });

      const data = await res.json();
      if (data.added) setIsFavourited(true);
      if (data.removed) setIsFavourited(false);
    } catch (error) {
      console.error("Error toggling favourite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavourite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 shadow-sm 
        ${isFavourited ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"} 
        hover:scale-110 ${className}`}
    >
      <Heart
        size={20}
        className={`transition-transform ${
          isFavourited ? "fill-current scale-110" : "scale-95"
        }`}
      />
    </button>
  );
}
