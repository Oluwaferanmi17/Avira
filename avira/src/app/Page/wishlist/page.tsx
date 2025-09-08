/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
const mockWishlist = [
  {
    id: 1,
    type: "Stay",
    title: "Cozy Apartment in Lekki",
    location: "Lekki, Lagos",
    image: "https://images.unsplash.com/photo-1600585154354-595dce27d52f?w=600",
    price: "₦45,000 / night",
  },
  {
    id: 2,
    type: "Event",
    title: "Calabar Carnival 2025",
    location: "Calabar, Cross River",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    price: "₦15,000 / ticket",
  },
  {
    id: 3,
    type: "Experience",
    title: "Olumo Rock Tour",
    location: "Abeokuta, Ogun State",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
    price: "₦10,000 / person",
  },
];
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlist);
  const removeItem = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">No favorites yet. Start exploring!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <span className="text-xs uppercase font-semibold text-[#00b894]">
                  {item.type}
                </span>
                <h3 className="text-lg font-bold mt-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.location}</p>
                <p className="text-gray-800 font-semibold mt-2">{item.price}</p>

                <div className="flex justify-between items-center mt-4">
                  <button className="flex items-center gap-2 text-sm text-[#00b894] hover:underline">
                    <FaHeart /> Book Now
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:underline"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
