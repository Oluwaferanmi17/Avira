"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bed, CalendarDays, Map, ScrollText, ArrowRight } from "lucide-react";

const WhatToDo = () => {
  const actions = [
    {
      title: "Find a Place to Stay",
      description:
        "Browse unique homes, hotels, and luxury stays across Nigeria.",
      icon: <Bed className="w-8 h-8 text-[#00b894]" />,
      href: "/stays", // Updated to standard routing convention
    },
    {
      title: "Explore Events",
      description:
        "Discover festivals, concerts, and cultural activities near you.",
      icon: <CalendarDays className="w-8 h-8 text-[#00b894]" />,
      href: "/events",
    },
    {
      title: "Local Experiences",
      description: "Visit amusement parks, museums, and guided food tours.",
      icon: <Map className="w-8 h-8 text-[#00b894]" />,
      href: "/experiences",
    },
    {
      title: "Track Your Journeys",
      description:
        "Keep a digital diary of your past memories and future plans.",
      icon: <ScrollText className="w-8 h-8 text-[#00b894]" />,
      href: "/trips",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            What would you like to do?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Curate your perfect Nigerian adventure with our all-in-one travel
            tools.
          </p>
        </motion.div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, idx) => (
            <Link key={idx} href={action.href} className="group h-full">
              <motion.div
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="
                  h-full
                  bg-white
                  rounded-3xl
                  p-6
                  border border-gray-100
                  shadow-sm hover:shadow-xl
                  hover:border-[#00b894]/30
                  transition-all duration-300
                  flex flex-col items-center text-center
                  relative overflow-hidden
                "
              >
                {/* Decorative Background Blob (Subtle) */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-green-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon Circle */}
                <div className="w-16 h-16 bg-[#d1f5ed] rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 z-10">
                  {action.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00b894] transition-colors z-10">
                  {action.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 z-10">
                  {action.description}
                </p>

                {/* Hover Action */}
                <div className="mt-auto flex items-center gap-2 text-[#00b894] font-semibold text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                  Start Exploring <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatToDo;
