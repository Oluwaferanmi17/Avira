"use client";
import { FC } from "react";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface EventCardProps {
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string;
  price: string;
}

const EventCard: React.FC<EventCardProps> = ({
  imageUrl,
  category,
  title,
  description,
  date,
  location,
  attendees,
  price,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 12 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto"
    >
      {/* Left - Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-72 md:h-full object-cover"
        />
        {/* Category Tag */}
        <span className="absolute bottom-4 left-4 bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full shadow">
          {category}
        </span>
      </div>

      {/* Right - Content */}
      <div className="p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

          {/* Event Details */}
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{date}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{location}</span>
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{attendees}</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 border-t pt-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-purple-700">From {price}</p>

          <Link href="#">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
