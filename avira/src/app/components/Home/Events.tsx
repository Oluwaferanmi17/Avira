"use client";
// import { motion } from "framer-motion";
// import EventCard from "../EventCard";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
const Events = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 w-290 py-16 px-6 sm:px-12 lg:px-24 rounded-3xl shadow-sm ml-5 mt-10 mb-10">
      <div className="text-center mb-12">
        <span className="inline-block bg-[#00b894] text-white text-sm font-medium px-4 py-2 rounded-full mb-4 shadow-md">
          Featured Event
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          Don&apos;t Miss Out
        </h1>
        <p className="text-gray-600 text-lg">
          Experience the most anticipated events and festivals
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row w-250 mx-auto border border-purple-100"
        >
          {/* Image Section */}
          <div className="relative md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80"
              alt="Felabration Festival"
              className="object-cover h-full w-full"
            />

            <span className="absolute bottom-3 left-3 bg-white/80 text-gray-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
              Music & Culture
            </span>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-between md:w-1/2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Felabration Music Festival
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Join us for the biggest celebration of Afrobeat music and
                culture, honoring the legacy of Fela Kuti with performances from
                top African artists, cultural exhibitions, and vibrant street
                parties.
              </p>

              {/* Event Details */}
              <div className="mt-6 space-y-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#00b894]" />
                  <span>October 15–22, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00b894]" />
                  <span>New Afrika Shrine, Lagos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00b894]" />
                  <span>10,000+ attendees</span>
                </div>
              </div>
            </div>

            {/* Price & Button */}
            <div className="mt-8 border-t border-gray-200 pt-6 flex items-center justify-between">
              <p className="text-xl font-semibold text-[#00b894]">
                From <span className="font-bold">₦5000</span>
              </p>
              <Link
                href="#"
                className="bg-[#00b894] hover:bg-[#019a7a] text-white font-medium px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <h1 className="text-[#00b894] hover:text-[#019a7a] text-center font-medium mt-10 text-xl">
        View All Upcoming Events <ArrowRight className="w-4 h-4" />
      </h1>
    </section>
  );
};

export default Events;
