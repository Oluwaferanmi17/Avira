"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
interface WelcomeToastProps {
  userName: string;
}
export default function WelcomeToast({ userName }: WelcomeToastProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 right-6 bg-[#00b894] text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          👋 Welcome {userName}!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
