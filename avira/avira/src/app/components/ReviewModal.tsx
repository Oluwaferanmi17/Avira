/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stayId?: string;
  eventId?: string;
  experienceId?: string;
  onSuccess?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  stayId,
  eventId,
  experienceId,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Dynamically attach only the correct type of review target
    const reviewData: any = {
      rating,
      comment,
    };

    if (stayId) reviewData.stayId = stayId;
    else if (eventId) reviewData.eventId = eventId;
    else if (experienceId) reviewData.experienceId = experienceId;

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    if (res.ok) {
      toast.success("You have left the review successfully!");
      onSuccess?.();
      onClose();
      setRating(0);
      setComment("");
    } else {
      const error = await res.json();
      toast.error(error.message || "Failed to submit review");
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Leave a Review
            </h2>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="border w-full p-2 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                disabled={loading || rating === 0}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-black text-white disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
