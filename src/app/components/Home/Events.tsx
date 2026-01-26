"use client";

import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Events = () => {
  return (
    <section className="bg-linear-to-br from-green-50 via-white to-orange-50 py-16 px-6 md:px-12 rounded-3xl my-16 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block bg-[#00b894] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-md"
        >
          Featured Event
        </motion.span>
        <h2 className="text-3xl md:text-5xl font-bold text-[#1c1c1c] mb-4">
          Don&apos;t Miss Out
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Experience the most anticipated cultural festivals and music events in
          Nigeria.
        </p>
      </div>

      {/* Featured Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto md:min-h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80"
            alt="Felabration Festival Crowd"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-w-768px) 100vw, 50vw"
            priority // Load this image quickly as it is featured
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
            🎵 Music & Culture
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2 bg-white/50 backdrop-blur-sm">
          <div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Felabration 2026
            </h3>
            <p className="text-gray-600 mt-4 leading-relaxed text-sm md:text-base">
              Join the biggest celebration of Afrobeat music and culture.
              Honoring the legacy of Fela Kuti with performances from top
              African artists, art exhibitions, and the famous &quot;Senior
              Man&quot; debates at the New Afrika Shrine.
            </p>

            {/* Details Grid */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-lg text-[#00b894]">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <span className="font-medium">October 12–18, 2026</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-lg text-[#00b894]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">
                  New Afrika Shrine, Ikeja, Lagos
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-lg text-[#00b894]">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-medium">30,000+ Attendees Expected</span>
              </div>
            </div>
          </div>

          {/* Footer / CTA */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Starting from</p>
              <p className="text-2xl font-bold text-[#00b894]">₦5,000</p>
            </div>

            <Link
              href="/events/felabration"
              className="w-full sm:w-auto bg-[#1c1c1c] hover:bg-[#00b894] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              Get Tickets
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* View All Link */}
      <div className="flex justify-center mt-12">
        <Link
          href="/events"
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-[#00b894] font-semibold text-lg transition-colors"
        >
          View All Upcoming Events
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default Events;
