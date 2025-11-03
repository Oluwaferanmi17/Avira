"use client";

import NavBar from "@/app/components/Home/NavBar";
import { useEffect, useState } from "react";

interface Stay {
  title: string;
  photos?: string[];
  address?: {
    city?: string;
    country?: string;
  };
  pricing?: {
    basePrice?: number;
  };
}

interface Event {
  title: string;
  photos?: string[];
  city?: string;
  ticketPrice?: number;
}

interface Experience {
  title: string;
  photos?: string[];
  city?: string;
  price?: number;
}

interface FavouriteItem {
  id: string;
  stay?: Stay;
  event?: Event;
  experience?: Experience;
}

export default function WishlistPage() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (!res.ok) {
          console.error("Failed to fetch wishlist:", res.status);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setFavourites(data);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    fetchFavourites();
  }, []);

  const removeFavourite = async (id: string) => {
    try {
      await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      setFavourites((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  if (favourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <NavBar />
        <h2 className="text-xl font-semibold">No items in your wishlist 💔</h2>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <h1 className="text-3xl font-bold text-center mb-8 mt-5 text-[#00b894]">
        My WishList
      </h1>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((fav) => {
          const item = fav.stay || fav.event || fav.experience;
          const type = fav.stay ? "Stay" : fav.event ? "Event" : "Experience";

          // ✅ Choose correct location & price for each type
          // const location =
          //   fav.stay?.locationValue ||
          //   fav.event?.city ||
          //   fav.experience?.locationValue ||
          //   "Unknown";

          // const price =
          //   fav.stay?.price ||
          //   fav.event?.ticketPrice ||
          //   fav.experience?.price ||
          //   "N/A";

          return (
            <div
              key={fav.id}
              className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
            >
              <img
                src={item?.photos?.[0] ?? "/placeholder.jpg"}
                alt={item?.title ?? "No title"}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-2">{item?.title}</h3>
              <p className="text-sm text-gray-500">{type}</p>
              <p className="font-medium text-gray-700 mt-1">
                {fav.stay?.address?.city ||
                  fav.event?.city ||
                  fav.experience?.city ||
                  "Location not available"}
              </p>
              <p className="text-emerald-600 font-semibold mt-1">
                ₦
                {fav.stay?.pricing?.basePrice ||
                  fav.event?.ticketPrice ||
                  fav.experience?.price ||
                  "N/A"}
              </p>
              <button
                onClick={() => removeFavourite(fav.id)}
                className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
