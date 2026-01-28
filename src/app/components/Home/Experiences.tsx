"use client";

import { motion } from "framer-motion";
import {
  Mountain,
  Umbrella,
  Eye,
  Utensils,
  Camera,
  Heart,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "adventure",
    title: "Adventure",
    description: "Thrilling outdoor activities and exploration in nature",
    count: "150+ experiences",
    color: "from-green-400 to-blue-500",
    icon: <Mountain className="w-8 h-8 text-white" />,
  },
  {
    id: "relaxation",
    title: "Relaxation",
    description: "Peaceful retreats and wellness activities for rejuvenation",
    count: "90+ experiences",
    color: "from-purple-400 to-indigo-500",
    icon: <Umbrella className="w-8 h-8 text-white" />,
  },
  {
    id: "sightseeing",
    title: "Sightseeing",
    description: "Guided tours to iconic landmarks and hidden gems",
    count: "200+ experiences",
    color: "from-orange-400 to-red-500",
    icon: <Eye className="w-8 h-8 text-white" />,
  },
  {
    id: "culinary",
    title: "Culinary",
    description: "Local food tours, cooking classes, and dining experiences",
    count: "80+ experiences",
    color: "from-yellow-400 to-orange-500",
    icon: <Utensils className="w-8 h-8 text-white" />,
  },
  {
    id: "photography",
    title: "Photography",
    description: "Photo walks and workshops in picturesque locations",
    count: "45+ experiences",
    color: "from-pink-400 to-purple-500",
    icon: <Camera className="w-8 h-8 text-white" />,
  },
  {
    id: "romantic",
    title: "Romantic",
    description: "Special experiences for couples and romantic getaways",
    count: "60+ experiences",
    color: "from-rose-400 to-pink-500",
    icon: <Heart className="w-8 h-8 text-white" />,
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ExperienceCategories() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#d0efe9] text-[#00b894] font-medium px-4 py-2 rounded-full shadow-sm mb-5"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending Categories</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl sm:text-4xl font-extrabold text-[#1c1c1c] mb-4"
          >
            Find Your Perfect Experience
          </motion.h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            From thrill-seeking adventures to calming retreats, discover the
            perfect vibe for your next trip.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
            >
              {/* Gradient Top Bar */}
              <div className={`h-2 w-full bg-linear-to-r ${item.color}`}></div>

              <div className="p-7 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-3.5 rounded-xl bg-linear-to-br ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <span className="bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full border border-gray-100">
                    {item.count}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00b894] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm grow">
                  {item.description}
                </p>

                <Link href={`Page/experiences`} className="mt-auto">
                  <button className="w-full bg-gray-50 hover:bg-[#00b894] hover:text-white text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    Explore {item.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-20 relative overflow-hidden bg-linear-to-br from-[#00b894] to-[#018a6e] text-white text-center rounded-3xl py-16 px-6 shadow-2xl"
        >
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Create Unforgettable Memories?
            </h2>
            <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
              Browse our complete collection of over 500+ verified experiences
              and start planning your adventure today.
            </p>

            <Link href="Page/experiences">
              <button className="bg-white text-[#00b894] font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:-translate-y-1 transition-all">
                View All Experiences
              </button>
            </Link>
          </div>
        </motion.section>
      </div>
    </section>
  );
}
