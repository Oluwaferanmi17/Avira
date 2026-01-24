import {
  CalendarDays,
  MessageSquare,
  X,
  User,
  Calendar as CalendarIcon,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // Assuming you have this component
import router from "next/router";
import { format, isWithinInterval, parseISO } from "date-fns";
import toast from "react-hot-toast";

// Define strict types
interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  guests: number;
  paymentStatus?: string;
  stay?: {
    title: string;
    address?: { city: string };
  };
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string; // Assuming API returns this
    image?: string;
  };
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/booking");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on selected calendar date
  useEffect(() => {
    if (selectedDate && bookings.length > 0) {
      const filtered = bookings.filter((b) => {
        try {
          return isWithinInterval(selectedDate, {
            start: parseISO(b.checkIn),
            end: parseISO(b.checkOut),
          });
        } catch (e) {
          return false;
        }
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings([]);
    }
  }, [selectedDate, bookings]);

  const handleContactGuest = async (receiverId?: string) => {
    if (!receiverId) return toast.error("Guest information unavailable");

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });

      if (!res.ok) throw new Error("Failed to start conversation");

      const conversation = await res.json();
      router.push(`/host/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not start conversation");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading bookings...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm text-gray-700 font-medium"
          >
            <CalendarIcon className="w-4 h-4" />
            View Calendar
          </button>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {booking.user?.name || "Guest"}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {booking.stay?.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="w-4 h-4" />
                    {format(parseISO(booking.checkIn), "MMM d, yyyy")}
                    <ChevronRight className="w-3 h-3" />
                    {format(parseISO(booking.checkOut), "MMM d, yyyy")}
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col items-end justify-between gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#00b894]">
                      ₦{booking.total?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => handleContactGuest(booking.user?.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      className="flex items-center gap-1.5 bg-gray-900 text-white border border-gray-900 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-800 transition"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setDetailsModalOpen(true);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No bookings yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Calendar Modal --- */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Availability Calendar</h2>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="border rounded-lg p-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </div>

              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-2">
                  {selectedDate
                    ? `Bookings for ${format(selectedDate, "MMM d, yyyy")}:`
                    : "Select a date to view active bookings."}
                </div>

                <div className="h-64 overflow-y-auto pr-2 space-y-2">
                  {selectedDate && filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 border rounded-lg bg-gray-50 text-sm"
                      >
                        <div className="font-medium text-gray-900">
                          {b.stay?.title}
                        </div>
                        <div className="flex justify-between mt-1 text-gray-600">
                          <span>{b.user?.name}</span>
                          <span
                            className={`text-xs px-2 rounded-full ${getStatusColor(b.status)}`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : selectedDate ? (
                    <div className="text-sm text-gray-400 italic">
                      No bookings found for this date.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Details Modal --- */}
      {detailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Booking Details
              </h2>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status Banner */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(selectedBooking.status)}`}
              >
                <span className="font-medium">Status</span>
                <span className="uppercase text-sm font-bold tracking-wider">
                  {selectedBooking.status}
                </span>
              </div>

              {/* Guest Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Guest Information
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.user?.name || "Unknown Guest"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.user?.email || "No email provided"}
                    </p>
                    {selectedBooking.user?.phone && (
                      <p className="text-sm text-gray-500">
                        {selectedBooking.user.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stay Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Check In
                  </h3>
                  <p className="font-medium text-gray-800">
                    {format(parseISO(selectedBooking.checkIn), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Check Out
                  </h3>
                  <p className="font-medium text-gray-800">
                    {format(parseISO(selectedBooking.checkOut), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Payment
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Total Amount</span>
                  </div>
                  <span className="font-bold text-lg text-[#00b894]">
                    ₦{selectedBooking.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
