"use client";
import { useState } from "react";
import { format } from "date-fns";
import CustomCalendar from "../components/CustomCalendar";

export default function BookingWidget({
  pricePerNight,
}: {
  pricePerNight: number;
}) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const total = nights * pricePerNight;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 sticky top-4">
      <h2 className="text-xl font-bold">
        ₦{pricePerNight.toLocaleString()} / night
      </h2>

      {/* Calendar */}
      <CustomCalendar
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
      />

      {/* Guests */}
      <div className="flex justify-between items-center border p-2 rounded-lg">
        <span>Guests</span>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="w-16 border rounded px-2"
        />
      </div>

      {/* Summary */}
      {nights > 0 && (
        <div className="border-t pt-2 text-sm">
          <p>
            {nights} nights × ₦{pricePerNight.toLocaleString()}
          </p>
          <p className="font-semibold mt-1">Total: ₦{total.toLocaleString()}</p>
        </div>
      )}

      {/* CTA */}
      <button className="bg-[#00b894] text-white w-full py-3 rounded-lg font-semibold hover:bg-[#019a7a]">
        Book Now
      </button>
    </div>
  );
}
