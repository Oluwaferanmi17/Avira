"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import NavBar from "../components/Home/NavBar";
const BecomeAHost = () => {
  return (
    <div className=" mx-auto">
      <NavBar />
      <main className="min-h-screen px-6 py-12 bg-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6"
        >
          <FaHome className="text-[#00b894]" />
          Become a Host on Avira
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 mb-10 max-w-xl"
        >
          List your space or event, share Nigeria&apos;s beauty, and earn
          income. Whether you have a cozy home or a spare room or want to
          organize events or experiences, we&apos;ll help you succeed as a host.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-3">Host a Stay</h2>
            <p className="text-gray-600 mb-4">
              Rent out your apartment, spare room, or house to travelers across
              Nigeria.
            </p>
            <Link
              href="/host/stay"
              className="inline-block bg-[#00b894] text-white px-6 py-2 rounded-full"
            >
              Start Hosting Stays
            </Link>
          </div>
          <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-3">Host an Event</h2>
            <p className="text-gray-600 mb-4">
              Share your culture! List your festival, party, or meetup and reach
              visitors.
            </p>
            <Link
              href="/host/event"
              className="inline-block bg-[#00b894] text-white px-6 py-2 rounded-full"
            >
              Start Hosting Events
            </Link>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          You’ll need an account to list. Already a host?
          <Link href="/host/dashboard" className="underline text-[#00b894]">
            Go to your dashboard
          </Link>
        </motion.p>
      </main>
    </div>
  );
};
export default BecomeAHost;
