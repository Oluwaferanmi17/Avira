"use client";

import { Fragment, useEffect, useState } from "react";
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
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface CustomCalendarProps {
  label: string;
  mode: "checkin" | "checkout";
  minDate?: Date;
  onSelect: (date: Date) => void;
}

/* ---------- PORTAL ---------- */
function CalendarPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}

/* ---------- COMPONENT ---------- */
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
    if (!open) setCurrentMonth(new Date());
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const renderMonth = (offset = 0) => {
    const base = addMonths(currentMonth, offset);
    const start = startOfMonth(base);
    const end = endOfMonth(base);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="w-[280px] px-2">
        <h4 className="text-center font-semibold text-sm mb-3">
          {format(base, "MMMM yyyy")}
        </h4>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d} className="text-xs text-gray-500">
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
                className={`w-9 h-9 rounded-full text-sm transition
                  ${disabled && "text-gray-300 cursor-not-allowed"}
                  ${
                    isCheckInDate
                      ? "border-2 border-[#00b894] text-[#00b894]"
                      : isSelected
                      ? "bg-[#00b894] text-white ring-4 ring-green-300"
                      : "hover:bg-green-50"
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
    <Popover className="relative">
      <Popover.Button
        className="flex flex-col text-left"
        onClick={() => setOpen(true)}
      >
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-sm">
          {selected ? format(selected, "MMM d") : "Add date"}
        </span>
      </Popover.Button>

      <Transition
        as={Fragment}
        show={open}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <CalendarPortal>
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setOpen(false)}
            />

            {/* CALENDAR */}
            <Popover.Panel
              static
              className="fixed top-[120px] left-1/2 -translate-x-1/2 z-[9999]
                         bg-white p-5 rounded-2xl shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Navigation */}
                <div className="flex justify-between mb-4 px-4">
                  <button
                    onClick={() => setCurrentMonth((p) => subMonths(p, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentMonth((p) => addMonths(p, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiChevronRight />
                  </button>
                </div>

                {/* Months */}
                <div className="flex gap-6">
                  {renderMonth(0)}
                  {renderMonth(1)}
                </div>
              </motion.div>
            </Popover.Panel>
          </>
        </CalendarPortal>
      </Transition>
    </Popover>
  );
}
