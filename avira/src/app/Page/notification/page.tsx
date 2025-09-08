"use client";
import { useState } from "react";
import { FaCalendarCheck, FaCommentDots, FaStar, FaHome } from "react-icons/fa";
const mockNotifications = [
  {
    id: 1,
    type: "booking",
    icon: <FaCalendarCheck className="text-green-500" />,
    title: "Booking Confirmed 🎉",
    message: "Your stay in Lekki Apartment has been confirmed.",
    date: "2 hours ago",
  },
  {
    id: 2,
    type: "message",
    icon: <FaCommentDots className="text-blue-500" />,
    title: "New Message",
    message: "Host John replied to your question about check-in time.",
    date: "5 hours ago",
  },
  {
    id: 3,
    type: "review",
    icon: <FaStar className="text-yellow-500" />,
    title: "New Review",
    message: "You received a 5-star review for hosting Calabar Carnival Stay.",
    date: "1 day ago",
  },
  {
    id: 4,
    type: "listing",
    icon: <FaHome className="text-purple-500" />,
    title: "Listing Views",
    message: "Your Abuja Villa listing got 20 new views today.",
    date: "2 days ago",
  },
];
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const clearAll = () => setNotifications([]);
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet 🎉</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-4 bg-white shadow rounded-xl p-4 hover:bg-gray-50 transition"
            >
              <div className="text-2xl">{notif.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{notif.title}</h3>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <span className="text-xs text-gray-400">{notif.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
