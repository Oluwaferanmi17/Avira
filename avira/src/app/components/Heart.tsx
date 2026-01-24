/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation"; // Optional: to refresh server data

interface HeartButtonProps {
  itemId: string;
  type: "stay" | "event" | "experience";
  initialFavourited?: boolean; // Receive status from parent
  className?: string;
  currentUser?: any; // Optional: If you want to force login check
}

export default function HeartButton({
  itemId,
  type,
  initialFavourited = false,
  className,
  currentUser,
}: HeartButtonProps) {
  // Initialize state with the prop passed from the server
  const [isFavourited, setIsFavourited] = useState(initialFavourited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // 1. Optional: Redirect to login if no user
    // if (!currentUser) return router.push("/login");

    if (loading) return;

    // 2. Optimistic Update: Switch UI immediately before API call
    const previousState = isFavourited;
    setIsFavourited(!previousState);
    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, type }),
      });

      const data = await res.json();

      // 3. Server Validation (Optional but recommended)
      // If server response conflicts with optimistic state, correct it here.
      if (res.ok) {
        // router.refresh(); // Updates server components (optional, useful for navbars)
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      // 4. Rollback: If API fails, revert the UI to previous state
      console.error("Error toggling favourite:", error);
      setIsFavourited(previousState);
      // alert("Something went wrong"); // Optional: Add toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavourite}
      disabled={loading}
      className={`
        p-2 rounded-full transition-all duration-200 shadow-sm group
        ${
          isFavourited
            ? "bg-rose-500 hover:bg-rose-600 border-rose-500"
            : "bg-white/80 hover:bg-white border-transparent"
        }
        hover:scale-110 active:scale-95
        ${className}
      `}
    >
      <Heart
        size={20}
        className={`transition-all duration-300 ${
          isFavourited
            ? "fill-white stroke-white"
            : "fill-neutral-500/10 stroke-neutral-600 group-hover:stroke-rose-500"
        }`}
      />
    </button>
  );
}
