// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Crown, MessageSquare, Settings, Sparkles } from "lucide-react";
import { FaBell, FaHeart, FaUserCircle } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
// import { pusherClient } from "@/lib/pusher";
// import AviraLogo from "./AviraLogo";
// import { icon } from "leaflet";
// import WelcomeToast from "./WelcomeToast";
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  // const [showWelcome, setShowWelcome] = useState(false);
  // useEffect(() => {
  //   if (session?.user) {
  //     setShowWelcome(true);
  //     const timer = setTimeout(() => setShowWelcome(false), 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [session]);
  // useEffect(() => {
  //   const fetchUnread = async () => {
  //     try {
  //       const res = await fetch("/api/notifications");
  //       if (!res.ok) throw new Error("Failed to fetch notifications");
  //       const data = await res.json();

  //       const unread = data.filter((n: any) => !n.read).length;
  //       setUnreadCount(unread);
  //     } catch (err) {
  //       console.error("Error fetching notifications:", err);
  //     }
  //   };

  //   fetchUnread();
  // }, []);
  // useEffect(() => {
  //   if (!session?.user?.id) return;

  //   const channel = pusherClient.subscribe(`user-${session.user.id}`);

  //   channel.bind("new-notification", (notification: any) => {
  //     setUnreadCount((prev) => prev + 1);
  //   });

  //   return () => {
  //     pusherClient.unsubscribe(`user-${session.user.id}`);
  //   };
  // }, [session?.user?.id]);

  const isLoggedIn = !!session;
  const navLinks = [
    { label: "Stays", href: "/Page/stay" },
    { label: "Events", href: "/Page/events" },
    { label: "Experiences", href: "/Page/experiences" },
    { label: "Become a Host", href: "/host" },
  ];
  const navExtras = [
    {
      icon: <FaHeart className="inline mr-2" />,
      label: "Wishlist",
      href: "/Page/wishlist",
    },
    {
      icon: <FaUserCircle className="inline mr-2" />,
      label: "Profile",
      href: "/Page/profile",
    },
    {
      // icon: <AviraLogo className="inline w-20 h-20" />,
      icon: <Bus className="inline" />,
      label: "Trip",
      href: "/Page/trips",
    },
    {
      icon: <MessageSquare className="inline mr-2" />,
      label: "Messages",
      href: "/Page/messages",
    },
    {
      icon: <Crown className="inline mr-2" />,
      label: "Host Dashboard",
      href: "/host/dashboard",
    },
    {
      icon: <Sparkles className="inline mr-2" />,
      label: "AI Trip Planner",
      href: "/Page/AI-TripCuriator",
    },
    {
      icon: <Settings className="inline mr-2" />,
      label: "Settings",
      href: "/Page/Settings",
    },
  ];
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
          <Link href="/" className="text-xl font-bold text-[#00b894]">
            {/* <AviraLogo /> */}
            Avira
          </Link>
        </motion.div>
        <ul className="hidden md:flex gap-6 text-gray-800 font-medium items-center">
          {navLinks.map((nav) => (
            <li key={nav.label}>
              <Link href={nav.href} className="hover:text-[#00b894] transition">
                {nav.label}
              </Link>
            </li>
          ))}
          {!isLoggedIn && (
            <li>
              <Link
                href="/auth?mode=signin"
                className="ml-4 bg-[#00b894] text-white px-4 py-2 rounded-xl hover:bg-[#019a7a] transition"
              >
                Login
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              {/* {showWelcome && session?.user?.name && (
                <WelcomeToast userName={session.user.name} />
              )} */}
              <li>
                <div className="relative group">
                  <img
                    src={session.user?.image || "/default-avatar.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </div>
              </li>
              {/* <li>
                <div>
                  <Link href="/host/dashboard">Switch To Hosting</Link>
                </div>
              </li> */}
            </>
          )}
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
              {/* {navLinks.map((nav) => (
                <li key={nav.label}>
                  <Link
                    href={nav.href}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-[#00b894]"
                  >
                    {/* {nav.label} */}
              {/* </Link> */}
              {/* </li> */}
              {/* // ))} */}
              {!isLoggedIn && (
                <li>
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block bg-[#00b894] text-white text-center px-4 py-2 rounded-xl"
                  >
                    Login/SignUp
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <>
                  {navExtras.map((nav) => (
                    <li key={nav.label}>
                      <Link
                        href={nav.href}
                        onClick={() => setIsOpen(false)}
                        className="block hover:text-[#00b894]"
                      >
                        {nav.icon} {nav.label}
                      </Link>
                    </li>
                  ))}
                  <li className="relative">
                    <Link
                      href="/Page/notification"
                      className="hover:text-[#00b894] flex items-center gap-2"
                    >
                      <FaBell /> Notifications
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                      className="block w-full bg-[#00b894] text-white text-center px-4 py-2 rounded-xl hover:bg-[#00a383] transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default NavBar;
