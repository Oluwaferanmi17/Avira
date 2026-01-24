import { MessageSquare, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Messages = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Optional: Fetch unread count to make the widget dynamic
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        // Mocking an endpoint - replace with your actual unread count API
        const res = await fetch("/api/messages/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        // Fail silently for a widget, or set to 0
        console.error("Failed to load message count", error);
      }
    };

    // fetchUnread(); // Uncomment when API is ready
  }, []);

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow duration-300">
        {/* Icon with Notification Badge */}
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-[#00b894]/10 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-[#00b894]" />
          </div>

          {/* Unread Badge (Conditional) */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Messages</h2>

        <p className="text-sm text-gray-500 mb-6 max-w-[200px] leading-relaxed">
          {unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""} from guests.`
            : "Communicate with guests and respond to inquiries."}
        </p>

        {/* Correct Next.js Link Usage */}
        <Link
          href="/host/messages"
          className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#00b894] text-white rounded-lg hover:bg-[#00a180] transition-all font-medium text-sm shadow-sm hover:shadow"
        >
          Open Inbox
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default Messages;
