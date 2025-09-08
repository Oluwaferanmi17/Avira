"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CalendarDays } from "lucide-react";
import { useBookingStore } from "@/Store/useBookingStore";
export default function ExperienceFlow() {
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);
  const [date, setDate] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const handleProceed = () => {
    setBooking({
      reservationId: "",
      type: "experience",
      item: {
        id: "exp-456",
        title: "Lagos Food Tour",
        location: "Lagos Island, Lagos",
      },
      schedule: { date },
      tickets: participants,
      dates: { checkIn: "", checkOut: "", nights: 0 },
      cost: {
        subtotal: participants * 150,
        service: 25,
        total: participants * 150 + 25,
      },
      createdAt: new Date().toISOString(),
      note,
    });
    router.push("/booking/confirm");
  };
  return (
    <div className="container mx-auto py-10">
      <div className="bg-white border rounded-2xl shadow p-6 max-w-md mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Experience Booking</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium">Experience Date</label>
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
          <label className="text-sm font-medium">Participants</label>
          <div className="flex items-center justify-between gap-2">
            <button
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
              onClick={() => setParticipants((p) => Math.max(1, p - 1))}
            >
              –
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>
                {participants} ticket{participants > 1 ? "s" : ""}
              </span>
            </div>
            <button
              className="px-3 py-1 border rounded-md hover:bg-gray-100"
              onClick={() => setParticipants((p) => p + 1)}
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
