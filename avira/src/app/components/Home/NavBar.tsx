"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus,
  Crown,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  User,
  Heart,
} from "lucide-react";
import { FaBell } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // 2. Get current path

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoggedIn = !!session?.user;
  const currentUserId = session?.user?.id;

  // --- Logic to check if we are on the home page ---
  const isHomePage = pathname === "/";

  const mainLinks: NavItem[] = [
    { label: "Stays", href: "/Page/stay" },
    { label: "Events", href: "/Page/events" },
    { label: "Experiences", href: "/Page/experiences" },
    { label: "Become a Host", href: "/host" },
  ];

  const userMenuLinks: NavItem[] = [
    { label: "Profile", href: "/Page/profile", icon: <User size={18} /> },
    { label: "Wishlist", href: "/Page/wishlist", icon: <Heart size={18} /> },
    { label: "Trips", href: "/Page/trips", icon: <Bus size={18} /> },
    {
      label: "Messages",
      href: "/Page/messages",
      icon: <MessageSquare size={18} />,
    },
    {
      label: "Host Dashboard",
      href: "/host/dashboard",
      icon: <Crown size={18} />,
    },
    {
      label: "AI Trip Planner",
      href: "/Page/AI-TripCuriator",
      icon: <Sparkles size={18} />,
    },
    { label: "Settings", href: "/Page/Settings", icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notification");
        if (res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unread = data.filter((n: any) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchUnread();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!currentUserId) return;
    const channel = pusherClient.subscribe(`user-${currentUserId}`);
    channel.bind("new-notification", () => setUnreadCount((prev) => prev + 1));
    channel.bind("new-message", () => setUnreadCount((prev) => prev + 1));
    return () => {
      pusherClient.unsubscribe(`user-${currentUserId}`);
    };
  }, [currentUserId]);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
        <motion.div
          className="absolute inset-0 shadow-sm"
          initial={false}
          animate={{
            // Force white background on inner pages, toggle on home page
            backgroundColor:
              !isHomePage || isScrolled
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0)",
            backdropFilter:
              !isHomePage || isScrolled ? "blur(12px)" : "blur(0px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-[#00b894] z-10 flex items-center gap-2"
          >
            <span>Avira</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition hover:text-[#00b894] ${
                  // Always dark text on inner pages
                  !isHomePage || isScrolled ? "text-gray-700" : "text-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 z-10">
            {isLoggedIn ? (
              <>
                <Link
                  href="/Page/notification"
                  className="relative p-2 text-gray-600 hover:text-[#00b894] transition"
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition bg-white"
                  >
                    <HiMenu className="text-gray-600" />
                    <img
                      src={session?.user?.image || "/default-avatar.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">
                              {session?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session?.user?.email}
                            </p>
                          </div>
                          <div className="py-2">
                            {userMenuLinks.map((link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00b894] transition"
                              >
                                {link.icon}
                                {link.label}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 pt-2 pb-1">
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                            >
                              <LogOut size={18} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:block">
                <Link
                  href="/auth?mode=signin"
                  className="bg-[#00b894] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#019a7a] transition shadow-md"
                >
                  Sign In
                </Link>
              </div>
            )}
            <button
              className="md:hidden p-2 text-gray-800 z-50"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 flex flex-col overflow-y-auto"
          >
            {/* ... Mobile Menu Content (Same as previous) ... */}
            <div className="flex flex-col gap-6">
              {!isLoggedIn && (
                <Link
                  href="/auth?mode=signin"
                  className="bg-[#00b894] text-white text-center py-3 rounded-xl font-bold"
                >
                  Sign In / Sign Up
                </Link>
              )}
              <div className="space-y-4">
                {mainLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-xl font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ THE FIX: THE SPACER DIV
        This renders an empty block with height (h-20) equal to the navbar.
        It pushes content down ONLY on inner pages. 
        It is hidden on the Home page ("/") so your hero images can still go under the transparent nav.
      */}
      {!isHomePage && <div className="h-20" aria-hidden="true" />}
    </>
  );
}
