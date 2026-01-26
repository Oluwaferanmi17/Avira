"use client";
import { FC } from "react";
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
  amenities = [],
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg border border-gray-100"
    >
      {/* Image + Rating */}
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 flex items-center bg-black/70 text-white text-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          {rating?.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-green-600 font-semibold">{price}</p>
        </div>

        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>

        <p className="text-gray-600 text-sm mt-3 leading-relaxed">
          {description}
        </p>
        <p className="text-gray-500 text-sm mt-1">{amenities}</p>
        <Link href={link}>
          <button className="mt-4 w-full bg-[#00b894] text-white py-2 rounded-lg font-medium hover:bg-[#019a7a] transition">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RetreatCard;
