"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaBed,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaPenFancy,
} from "react-icons/fa";
const WhatToDo = () => {
  const actions = [
    {
      title: "Find a Place to Stay",
      description: "Browse unique homes, hotels, and stays across Nigeria.",
      icon: <FaBed className="text-3xl text-[#00b894]" />,
      href: "/stays",
    },
    {
      title: "Explore Events",
      description: "Discover festivals, concerts, and cultural activities.",
      icon: <FaCalendarAlt className="text-3xl text-[#00b894]" />,
      href: "/events",
    },
    {
      title: "Local Experiences",
      description: "Visit amusement parks, museums, and food tours.",
      icon: <FaMapMarkedAlt className="text-3xl text-[#00b894]" />,
      href: "/experiences",
    },
    {
      title: "Plan Your Trip",
      description: "Build your itinerary and save events or stays.",
      icon: <FaPenFancy className="text-3xl text-[#00b894]" />,
      href: "/trip",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 px-6 md:px-12">
      <motion.h2
        initial={{ x: -600 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800"
      >
        What would you like to do?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className="bg-white hover:bg-[#e6fdf8] border border-gray-200 shadow-sm rounded-2xl p-6 transition group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="flex flex-col items-start gap-4"
            >
              <div className="p-3 bg-[#d1f5ed] rounded-full">{action.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#00b894] transition">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium text-[#00b894]">
                  Click to explore →
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default WhatToDo;
