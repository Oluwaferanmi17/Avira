"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isSameDay, isWithinInterval, parseISO } from "date-fns";
import { useState } from "react";

const mockBookings = [
  { from: "2025-07-16", to: "2025-07-18" },
  { from: "2025-07-22", to: "2025-07-24" },
];

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isBooked = (date: Date) => {
    return mockBookings.some((booking) =>
      isWithinInterval(date, {
        start: parseISO(booking.from),
        end: parseISO(booking.to),
      })
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Booking Calendar</h3>
      <Calendar
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date)}
        tileClassName={({ date }) =>
          isBooked(date) ? "bg-rose-200 text-rose-800 rounded-full" : ""
        }
      />
    </div>
  );
}
