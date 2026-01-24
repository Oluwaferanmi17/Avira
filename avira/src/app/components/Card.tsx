"use client";

import { FC } from "react";
import { MapPin, Star } from "lucide-react"; // Added example icons
import Link from "next/link";
import Image from "next/image";

interface RetreatCardProps {
  imageUrl: string;
  title: string;
  location: string;
  price: string;
  rating?: number;
  description: string;
  link?: string;
  amenities?: string[];
}

const RetreatCard: FC<RetreatCardProps> = ({
  imageUrl,
  title,
  location,
  price,
  rating,
  description,
  link = "#",
  amenities = [], // Default to empty array
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* 1. Image Section using Next/Image */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
        />
        {rating && (
          <div className="absolute top-3 right-3 flex items-center bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* 2. Content Section (Flex Grow pushes button down) */}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-[#00b894] font-bold text-sm whitespace-nowrap ml-2">
            {price}
          </p>
        </div>

        <div className="flex items-center text-gray-500 text-xs font-medium mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
          {location}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* 3. Amenities Handling (Optional: Display badges) */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {/* Only show first 3 amenities to keep card clean */}
            {amenities.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* 4. Button - Pushed to bottom via mt-auto if no amenities exist, or naturally flows */}
        <div className="mt-auto pt-2">
          <Link href={link} className="block w-full">
            <button className="w-full bg-gray-50 hover:bg-[#00b894] text-gray-900 hover:text-white border border-gray-200 hover:border-transparent py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RetreatCard;
