/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

export default function EventCard({ event }: { event: any }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      <div className="relative w-full h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{event.title}</h3>
        <p className="flex items-center text-sm text-gray-600 mt-1">
          <FaCalendarAlt className="mr-2 text-[#00b894]" /> {event.date}
        </p>
        <p className="flex items-center text-sm text-gray-600 mt-1">
          <FaMapMarkerAlt className="mr-2 text-[#00b894]" /> {event.location}
        </p>
        <span className="inline-block mt-3 text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full">
          {event.category}
        </span>
      </div>
    </Link>
  );
}
