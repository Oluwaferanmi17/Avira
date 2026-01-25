"use client";
import { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isBefore,
  isSameDay,
} from "date-fns";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CustomCalendarProps {
  label: string;
  mode: "checkin" | "checkout";
  minDate?: Date;
  onSelect: (date: Date) => void;
}

export default function CustomCalendar({
  label,
  mode,
  minDate,
  onSelect,
}: CustomCalendarProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  useEffect(() => {
    // Reset when closed
    if (!open) setCurrentMonth(new Date());
  }, [open]);

  const renderMonth = (offset = 0) => {
    const base = addMonths(currentMonth, offset);
    const start = startOfMonth(base);
    const end = endOfMonth(base);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-[280px] px-2">
        <h4 className="text-center font-semibold text-sm text-gray-800 mb-3">
          {format(base, "MMMM yyyy")}
        </h4>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="text-xs text-gray-500 font-medium">
              {d}
            </span>
          ))}
          {days.map((day) => {
            const isCheckInDate =
              mode === "checkout" &&
              minDate &&
              day.toDateString() === minDate.toDateString();

            const disabled =
              isBefore(day, minDate ?? new Date()) && !isCheckInDate;

            const isSelected = selected && isSameDay(day, selected);

            return (
              <button
                key={day.toISOString()}
                disabled={disabled}
                onClick={() => {
                  if (!disabled && !isCheckInDate) {
                    setSelected(day);
                    onSelect(day);
                    setOpen(false);
                  }
                }}
                title={isCheckInDate ? "Check-in date" : ""}
                className={`w-9 h-9 text-sm rounded-full transition-all duration-200
        ${disabled ? "text-gray-300 cursor-not-allowed" : ""}
        ${
          isCheckInDate
            ? "border-2 border-[#00b894] text-[#00b894] font-semibold bg-green-50"
            : isSelected
            ? "bg-[#00b894] text-white ring-4 ring-[#00ffc3] shadow-lg animate-pulse"
            : "hover:bg-green-50 hover:ring-2 hover:ring-green-300"
        }
      `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Popover className="relative z-50">
      <Popover.Button
        className="flex flex-col text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-sm text-gray-800">
          {selected ? format(selected, "MMM d") : "Add date"}
        </span>
      </Popover.Button>

      <Transition
        as={Fragment}
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <Popover.Panel className="absolute mt-2 bg-white p-4 shadow-xl rounded-xl w-auto z-[999]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Arrows */}
            <div className="flex items-center justify-between px-4 mb-3">
              <button
                onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Two months side-by-side */}
            <div className="flex gap-6">
              {renderMonth(0)}
              {renderMonth(1)}
            </div>
          </motion.div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
