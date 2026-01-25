"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CalendarDays } from "lucide-react";
import { useBookingStore } from "@/Store/useBookingStore";
import { useSession } from "next-auth/react";
export default function EventFlow() {
  const router = useRouter();
  const [date, setDate] = useState<string>("");
  const [tickets, setTickets] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);
  const { data: session } = useSession();
  const handleProceed = async () => {
    // if (!booking?.item?.id || booking.item.price === undefined) return;
    if (!booking?.item?.id) {
      alert("Missing event ID");
      return;
    }
    if (!session?.user?.id) {
      alert("You must be logged in to book an event");
      router.push("/login");
      return;
    }
    // const isFree = booking.item.price === 0;
    // const subtotal = tickets * booking.item.price;
    // const service = isFree ? 0 : Math.round(subtotal * 0.05);
    // const total = subtotal + service;

    // const updatedBooking = {
    //   ...booking,
    //   tickets,
    //   note,
    //   schedule: { date },
    //   cost: { subtotal, service, total },
    //   createdAt: new Date().toISOString(),
    // };

    // setBooking(updatedBooking);

    try {
      const res = await fetch("/api/bookingEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id, // ✅ comes from auth
          eventId: booking.item.id, // TODO: pass actual event ID dynamically
          tickets,
          note,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create booking");
      }
      const bookingResponse = await res.json();
      setBooking({
        reservationId: bookingResponse.id,
        type: "event",
        item: {
          id: bookingResponse.event.id,
          title: bookingResponse.event.title,
          location: `${bookingResponse.event.city}, ${bookingResponse.event.country}`,
        },
        schedule: { date },
        tickets: bookingResponse.tickets,
        dates: { checkIn: "", checkOut: "", nights: 0 },
        cost: {
          subtotal: bookingResponse.subtotal,
          service: bookingResponse.service,
          total: bookingResponse.total,
        },
        createdAt: bookingResponse.createdAt,
        note: bookingResponse.note,
      });

      router.push(`/booking/confirm/${bookingResponse.id}`);
    } catch (error) {
      console.error("Error booking event:", error);
      alert("Something went wrong while booking.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white border rounded-2xl shadow p-6 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Event Booking</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium">Event Date</label>
          <div className="flex items-center gap-2 border rounded-md p-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-none focus:ring-0 text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Tickets</label>
          <div className="flex items-center justify-between gap-2">
            <button
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
              onClick={() => setTickets((t) => Math.max(1, t - 1))}
            >
              –
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>
                {tickets} ticket{tickets > 1 ? "s" : ""}
              </span>
            </div>
            <button
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
              onClick={() => setTickets((t) => t + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Note (optional)</label>
          <textarea
            placeholder="Any special request..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#00b894]"
          />
        </div>
        <button
          className={`w-full py-2 rounded-md text-white ${
            date
              ? "bg-[#00b894] hover:bg-[#019074]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleProceed}
          disabled={!date}
        >
          Continue to Confirmation
        </button>
      </div>
    </div>
  );
}
