"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { FaCalendarCheck, FaCommentDots, FaStar, FaHome } from "react-icons/fa";
import NavBar from "@/app/components/Home/NavBar";
import { useSession } from "next-auth/react";
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  iconColor?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  // Real-time listener
  // useEffect(() => {
  //   if (!currentUserId) return; // Wait until user data is loaded
  //   const channel = pusherClient.subscribe(`user-${currentUserId}`);
  //   pusherClient.subscribe("notifications-channel");
  //   pusherClient.bind("new-notification", (newNotif: Notification) => {
  //     setNotifications((prev) => [newNotif, ...prev]);
  //   });
  //   return () => {
  //     pusherClient.unsubscribe("notifications-channel");
  //   };
  // }, [currentUserId]);

  const clearAll = async () => {
    await fetch("/api/notifications/clear", { method: "DELETE" });
    setNotifications([]);
  };

  return (
    <div>
      <NavBar />

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
                <div className="text-2xl">
                  {notif.type === "booking" && (
                    <FaCalendarCheck className="text-green-500" />
                  )}
                  {notif.type === "message" && (
                    <FaCommentDots className="text-blue-500" />
                  )}
                  {notif.type === "review" && (
                    <FaStar className="text-yellow-500" />
                  )}
                  {notif.type === "listing" && (
                    <FaHome className="text-purple-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notif.title}</h3>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.date).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
