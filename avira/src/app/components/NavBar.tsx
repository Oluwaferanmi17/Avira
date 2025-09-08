"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { FaBell } from "react-icons/fa";
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const navLinks = [
    { label: "Homes", href: "/Page/stay" },
    { label: "Events", href: "/Page/events" },
    { label: "Experiences", href: "/Page/experiences" },
    { label: "Become a Host", href: "/host" },
  ];
  const navExtras = [
    { label: "Wishlist", href: "/Page/wishlist" },
    {
      icon: <User className="inline mr-2" />,
      label: "Profile",
      href: "/Page/profile",
    },
    { label: "Trip", href: "/Page/trips" },
    // { label: "Notification", href: "/Page/notification" },
    { label: "Help Center", href: "/help" },
    { label: "Refer a Host", href: "/refer" },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className="bg-transparent sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <motion.nav
        initial={{ y: -100, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
        className="max-w-7xl mx-auto flex items-center justify-between px-12 py-4"
      >
        <motion.div
          animate={{
            backgroundColor: isScrolled
              ? "rgba(255,255,255,0.8)"
              : "rgba(255,255,255,0)",
            boxShadow: isScrolled
              ? "0 4px 12px rgba(0, 0, 0, 0.1)"
              : "0 0 0 rgba(0, 0, 0, 0)",
            backdropFilter: isScrolled ? "blur(10px)" : "blur(0px)",
            height: isScrolled ? "60px" : "80px",
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 -z-10 rounded-none"
        />
        <motion.div
          animate={{ scale: isScrolled ? 0.9 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className=" text-xl font-bold text-[#00b894]">
            Avira
          </Link>
        </motion.div>
        <ul className="hidden md:flex gap-6 text-gray-800 font-medium">
          {navLinks.map((nav) => (
            <li key={nav.label}>
              <Link href={nav.href} className="hover:text-[#00b894] transition">
                {nav.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/auth?mode=signin"
              className="ml-4 bg-[#00b894] text-white px-4 py-2 rounded-xl hover:bg-[#019a7a] transition"
            >
              Login
            </Link>
          </li>
        </ul>
        <button
          className="text-2xl text-gray-800 md:block"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </motion.nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed md:absolute md:top-full md:right-6 md:w-64 inset-0 md:inset-auto bg-white/90 backdrop-blur-md z-40 px-6 py-6 shadow-xl rounded-lg md:rounded-xl"
          >
            <ul className="flex flex-col gap-4 text-gray-800 font-medium">
              {navLinks.map((nav) => (
                <li key={nav.label}>
                  <Link
                    href={nav.href}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-[#00b894]"
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block bg-[#00b894] text-white text-center px-4 py-2 rounded-xl"
                >
                  Login/SignUp
                </Link>
              </li>
              <hr className="my-2 border-gray-300" />
              {navExtras.map((nav) => (
                <li key={nav.label}>
                  <Link
                    href={nav.href}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-[#00b894]"
                  >
                    {nav.icon}
                    {nav.label}
                  </Link>
                </li>
              ))}
              <li className="relative">
                <Link
                  href="/Page/notification"
                  className="hover:text-[#00b894] flex justify center gap-2"
                >
                  <FaBell className="text-xl" /> Notifications
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default NavBar;
