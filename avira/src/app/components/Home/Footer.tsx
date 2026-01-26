"use client";

import {
  MapPin,
  Twitter,
  Instagram,
  Facebook,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Stays", href: "/stays" },
    { name: "Events", href: "/events" },
    { name: "Experiences", href: "/experiences" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Safety Information", href: "/safety" },
    { name: "Cancellation Options", href: "/terms" },
    { name: "Report a Concern", href: "/privacy" },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Facebook className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-[#1c1c1c] text-gray-300 py-16 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#00b894] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Avira
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Connecting travelers with authentic Nigerian cultural experiences.
              From the Savannah to the Coast, discover the real Nigeria with us.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, color: "#00b894" }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Discover</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[#00b894] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b894] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[#00b894] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest travel tips and exclusive deals sent to your inbox.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894] transition-all placeholder:text-gray-600 text-sm"
                />
              </div>
              <button className="w-full bg-[#00b894] hover:bg-[#019a7a] text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Avira Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
