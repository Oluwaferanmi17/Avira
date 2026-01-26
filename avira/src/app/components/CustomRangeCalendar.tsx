"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  startOfToday,
  getDay,
} from "date-fns";

// Define our own simple type so we don't rely on libraries
export interface DateRange {
  from?: Date;
  to?: Date;
}

interface CustomRangeCalendarProps {
  value?: DateRange;
  onChange: (value: DateRange) => void;
}

export default function CustomRangeCalendar({
  value,
  onChange,
}: CustomRangeCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = startOfToday();

  // Navigation handlers
  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  // Generate days for the current view
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate empty slots for start of month alignment
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  const startDayIndex = getDay(monthStart);

  const handleDayClick = (day: Date) => {
    // 1. If past date, ignore (optional, remove if you want to allow past dates)
    if (isBefore(day, today)) return;

    const currentRange = value || {};

    // Logic for selecting range
    if (!currentRange.from || (currentRange.from && currentRange.to)) {
      // Start a new range
      onChange({ from: day, to: undefined });
    } else if (currentRange.from && !currentRange.to) {
      // Completing the range
      if (isBefore(day, currentRange.from)) {
        // User clicked a date BEFORE the start date, so swap them or reset start
        onChange({ from: day, to: undefined });
      } else {
        // Valid range
        onChange({ ...currentRange, to: day });
      }
    }
  };

  // Helper to determine day styling
  const getDayClasses = (day: Date) => {
    const isPast = isBefore(day, today);
    if (isPast) return "text-slate-300 cursor-not-allowed bg-transparent";

    const isSelectedStart = value?.from && isSameDay(day, value.from);
    const isSelectedEnd = value?.to && isSameDay(day, value.to);
    const isInRange =
      value?.from &&
      value?.to &&
      isWithinInterval(day, { start: value.from, end: value.to });

    if (isSelectedStart && isSelectedEnd) {
      return "bg-[#00b894] text-white rounded-full hover:bg-[#00a383]";
    }
    if (isSelectedStart) {
      return "bg-[#00b894] text-white rounded-l-full rounded-r-none hover:bg-[#00a383]";
    }
    if (isSelectedEnd) {
      return "bg-[#00b894] text-white rounded-r-full rounded-l-none hover:bg-[#00a383]";
    }
    if (isInRange) {
      return "bg-[#e6f7f4] text-[#00b894] rounded-none hover:bg-[#d0f0eb]"; // Light teal background
    }

    return "hover:bg-slate-100 text-slate-700 rounded-full";
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="p-4 w-full max-w-[320px] mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          disabled={isBefore(viewDate, startOfMonth(today))} // Optional: prevent going back past today
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-slate-800">
          {format(viewDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {/* Weekday Headers */}
        {weekDays.map((d) => (
          <div key={d} className="text-xs font-medium text-slate-400 mb-2">
            {d}
          </div>
        ))}

        {/* Empty slots for previous month days */}
        {Array.from({ length: startDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {daysInMonth.map((day) => (
          <div key={day.toString()} className="relative p-[2px]">
            <button
              onClick={() => handleDayClick(day)}
              className={`
                w-9 h-9 text-sm font-medium transition-all flex items-center justify-center mx-auto
                ${getDayClasses(day)}
              `}
              disabled={isBefore(day, today)}
            >
              {format(day, "d")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
