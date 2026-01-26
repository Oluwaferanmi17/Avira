"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome, FaCalendarAlt, FaCompass } from "react-icons/fa"; // Added icons for variety
import NavBar from "../components/Home/NavBar";

const BecomeAHost = () => {
  // Animation variants for cleaner code
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 flex items-center gap-4"
          >
            <span className="p-3 bg-[#00b894]/10 rounded-full text-[#00b894]">
              <FaHome size={32} />
            </span>
            Become a Host on Avira
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl leading-relaxed"
          >
            List your space or event, share Nigeria&apos;s beauty, and earn
            income. Whether you have a cozy home, a spare room, or want to
            organize unforgettable experiences, we&apos;ll help you succeed.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {/* Card 1: Stays */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-4 text-[#00b894]">
              <FaHome size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Host a Stay
            </h2>
            <p className="text-gray-600 mb-6 min-h-[48px]">
              Rent out your apartment, spare room, or vacation house to
              travelers across Nigeria.
            </p>
            <Link
              href="/host/stay"
              className="inline-block w-full text-center bg-[#00b894] hover:bg-[#00a180] text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Start Hosting Stays
            </Link>
          </motion.div>

          {/* Card 2: Events */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-4 text-[#00b894]">
              <FaCalendarAlt size={36} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Host an Event
            </h2>
            <p className="text-gray-600 mb-6 min-h-[48px]">
              Share your vibe! List your festival, tech meetup, or exclusive
              party and reach eager attendees.
            </p>
            <Link
              href="/host/event"
              className="inline-block w-full text-center bg-[#00b894] hover:bg-[#00a180] text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Start Hosting Events
            </Link>
          </motion.div>

          {/* Card 3: Experiences */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="mb-4 text-[#00b894]">
              <FaCompass size={38} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Host an Experience
            </h2>
            <p className="text-gray-600 mb-6 min-h-[48px]">
              Lead a guided tour, teach a cooking class, or host a workshop to
              share your unique skills.
            </p>
            <Link
              href="/host/experience"
              className="inline-block w-full text-center bg-[#00b894] hover:bg-[#00a180] text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Start Hosting Experience
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <p className="text-gray-500 text-lg">
            You’ll need an account to get started. <br className="md:hidden" />{" "}
            Already a host?{" "}
            <Link
              href="/host/dashboard"
              className="text-[#00b894] font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Go to your dashboard &rarr;
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default BecomeAHost;
