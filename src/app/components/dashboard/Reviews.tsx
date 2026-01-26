import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar, FaReply, FaRegCommentDots } from "react-icons/fa";

// 1. Defined strict types (No 'any')
interface User {
  name?: string;
  image?: string;
}

interface ReviewTarget {
  title?: string;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user?: User;
  stay?: ReviewTarget;
  event?: ReviewTarget;
  experience?: ReviewTarget;
  reply?: {
    message: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. State to manage input text for each review independently
  const [draftReplies, setDraftReplies] = useState<{ [key: string]: string }>(
    {},
  );

  // 3. State to track which specific review is currently submitting
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/host/reviews");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // Assuming API returns data in the correct shape, otherwise map here
        setReviews(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleInputChange = (reviewId: string, value: string) => {
    setDraftReplies((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async (reviewId: string) => {
    const message = draftReplies[reviewId];
    if (!message?.trim()) return;

    setSubmittingId(reviewId);

    try {
      const res = await fetch("/api/host/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, message }),
      });

      if (res.ok) {
        toast.success("Reply sent!");

        // 4. Optimistically update the UI by updating the local reviews state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId ? { ...review, reply: { message } } : review,
          ),
        );

        // Clear the draft
        setDraftReplies((prev) => {
          const newState = { ...prev };
          delete newState[reviewId];
          return newState;
        });
      } else {
        throw new Error("Failed to reply");
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSubmittingId(null);
    }
  };

  // 5. Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white shadow rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  // 6. Empty State
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow text-gray-500">
        <FaRegCommentDots className="text-4xl mb-3 opacity-50" />
        <p>No reviews received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white shadow rounded-xl p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <img
                src={review.user?.image || "/default-avatar.png"}
                alt={review.user?.name || "Guest"}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {review.user?.name || "Anonymous Guest"}
                </h3>
                <p className="text-sm text-gray-500">
                  {review.stay?.title ||
                    review.event?.title ||
                    review.experience?.title ||
                    "General Review"}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {new Date(review.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-sm ${
                  i < review.rating ? "text-yellow-400" : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-gray-600 leading-relaxed text-sm">
            &quot;{review.comment}&quot;
          </p>

          <div className="mt-5 border-t pt-4">
            {review.reply ? (
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg flex gap-3">
                <div className="mt-1 text-[#00b894]">
                  <FaReply className="transform rotate-180" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 uppercase mb-1">
                    Your Reply
                  </p>
                  <p className="text-sm text-gray-600">
                    {review.reply.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Write a public response..."
                  value={draftReplies[review.id] || ""}
                  onChange={(e) => handleInputChange(review.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReplySubmit(review.id);
                  }}
                  disabled={submittingId === review.id}
                  className="flex-1 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#00b894]/20 focus:border-[#00b894] transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleReplySubmit(review.id)}
                  disabled={
                    submittingId === review.id || !draftReplies[review.id]
                  }
                  className="bg-[#00b894] hover:bg-[#00a180] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {submittingId === review.id ? "Sending..." : "Reply"}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
