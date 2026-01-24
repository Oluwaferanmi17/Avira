"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react"; // Assuming you are using lucide-react, or use react-icons

interface WelcomeToastProps {
  userName: string;
  onClose?: () => void; // Optional callback to clean up parent state
}

export default function WelcomeToast({ userName, onClose }: WelcomeToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle manual close
  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence
      // This ensures the parent callback fires only AFTER the animation finishes
      onExitComplete={() => {
        if (onClose) onClose();
      }}
    >
      {isVisible && (
        <motion.div
          key="welcome-toast"
          role="status"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md border border-green-100 text-gray-800 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-sm"
        >
          {/* Avatar / Icon Placeholder */}
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-xl shadow-inner">
            👋
          </div>

          <div className="flex-1">
            <p className="font-bold text-sm text-[#00b894]">Welcome back!</p>
            <p className="text-sm font-medium text-gray-600 truncate max-w-[150px]">
              {userName}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
