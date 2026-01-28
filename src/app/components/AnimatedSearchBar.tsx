/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
// --- Types ---
type Step = "DESTINATION" | "CHECK_IN" | "CHECK_OUT" | "READY";

// --- Helper Functions for Date Logic ---
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const formatDate = (date: Date | null) => {
  if (!date) return "Add dates";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// --- Calendar Component ---
interface CalendarProps {
  currentDate: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  selecting: "CHECK_IN" | "CHECK_OUT";
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const CalendarPicker: React.FC<CalendarProps> = ({
  currentDate: initialDate,
  checkIn,
  checkOut,
  selecting,
  onSelect,
}) => {
  const [viewDate, setViewDate] = useState(initialDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // If selecting checkout, disable dates before check-in
    if (selecting === "CHECK_OUT" && checkIn && date <= checkIn) return true;

    return false;
  };

  const isSelected = (day: number) => {
    const date = new Date(year, month, day).getTime();
    return checkIn?.getTime() === date || checkOut?.getTime() === date;
  };

  const isInRange = (day: number) => {
    const date = new Date(year, month, day).getTime();
    if (checkIn && checkOut) {
      return date > checkIn.getTime() && date < checkOut.getTime();
    }
    if (checkIn && hoverDate && selecting === "CHECK_OUT") {
      return date > checkIn.getTime() && date < hoverDate.getTime();
    }
    return false;
  };

  return (
    <div className="absolute top-20 left-0 md:left-auto md:right-0 bg-white p-6 rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.28)] z-50 w-[350px] animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-[#03d1a8] rounded-full transition-colors"
        >
          {/* [#00b894] */}
          <ChevronLeft size={20} />
        </button>
        <div className="font-semibold text-lg">
          {viewDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#03d1a8] rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 font-medium text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const inRange = isInRange(day);

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onSelect(new Date(year, month, day))}
              onMouseEnter={() => setHoverDate(new Date(year, month, day))}
              onMouseLeave={() => setHoverDate(null)}
              className={`
                h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                ${
                  disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:border-2 hover:border-[#01987a] "
                }
                ${
                  selected
                    ? "bg-[#00b894]  text-white hover:bg-[#00b894]  hover:border-transparent"
                    : ""
                }
                ${
                  inRange && !selected
                    ? "bg-gray-100 rounded-none w-full mx-0"
                    : ""
                }
                ${
                  inRange &&
                  !selected &&
                  (day === 1 || blanks.length + day - (1 % 7) === 0)
                    ? "rounded-l-full"
                    : ""
                }
              `}
            >
              <span className="relative z-10">{day}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
          {selecting === "CHECK_IN" ? "Select Check-in" : "Select Check-out"}
        </div>
        <div className="text-xs text-gray-400">Exact dates</div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function AirbnbSearch() {
  const [step, setStep] = useState<Step>("DESTINATION");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  // UI State
  const [activeField, setActiveField] = useState<Step | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && destination.trim()) {
      setStep("CHECK_IN");
      setActiveField("CHECK_IN");
    }
  };

  const handleDateSelect = (date: Date) => {
    if (activeField === "CHECK_IN") {
      setCheckIn(date);
      setCheckOut(null); // Reset checkout if checkin changes
      setStep("CHECK_OUT");
      setActiveField("CHECK_OUT");
    } else if (activeField === "CHECK_OUT") {
      setCheckOut(date);
      setStep("READY");
      setActiveField(null); // Close calendar
    }
  };

  // const resetSearch = () => {
  //   setDestination("");
  //   setCheckIn(null);
  //   setCheckOut(null);
  //   setStep("DESTINATION");
  //   setActiveField(null);
  // };

  // const router = useRouter();

  // const handleSearch = () => {
  //   // Validation
  //   if (!destination) {
  //     setActiveField("DESTINATION");
  //     return;
  //   }

  //   // 2. Construct Query Params
  //   const params = new URLSearchParams();

  //   if (destination) params.set("location", destination);
  //   if (checkIn) params.set("checkIn", checkIn.toISOString());
  //   if (checkOut) params.set("checkOut", checkOut.toISOString());

  //   // 3. Navigate to the search page
  //   // This turns /search?location=Paris&checkIn=2024-01-01...
  //   router.push(`/search?${params.toString()}`);
  // };
  const router = useRouter();
  // const handleSearch = async () => {
  //   if (!destination || !checkIn || !checkOut) {
  //     if (!destination) setActiveField("DESTINATION");
  //     else if (!checkIn) setActiveField("CHECK_IN");
  //     return;
  //   }

  //   try {
  //     const params = new URLSearchParams({
  //       destination,
  //       checkIn: checkIn.toISOString(),
  //       checkOut: checkOut.toISOString(),
  //     });

  //     const res = await fetch(`/api/search?${params.toString()}`);

  //     if (!res.ok) {
  //       throw new Error("Search failed");
  //     }

  //     const data = await res.json();

  //     console.log("Search results:", data);
  //     // TODO: route to results page or store in state
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   router.push(
  //     `/search?destination=${encodeURIComponent(
  //       destination
  //     )}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`
  //   );
  // };
  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) {
      if (!destination) setActiveField("DESTINATION");
      else if (!checkIn) setActiveField("CHECK_IN");
      return;
    }

    router.push(
      `/Page/search?destination=${encodeURIComponent(
        destination,
      )}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`,
    );
  };

  return (
    <div className="flex flex-col items-center font-sans text-gray-800">
      {/* SEARCH BAR CONTAINER */}
      <div ref={searchContainerRef} className="relative group">
        <div
          className={`
          flex items-center bg-white border border-gray-200 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] 
          transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]
          ${activeField ? "bg-gray-100" : ""}
        `}
        >
          {/* 1. Destination Input */}
          <div
            onClick={() => setActiveField("DESTINATION")}
            className={`
              relative px-8 py-3.5 rounded-full cursor-pointer hover:bg-gray-100 transition
              ${activeField === "DESTINATION" ? "bg-white shadow-lg z-20" : ""}
              min-w-[280px]
            `}
          >
            <div className="text-xs font-bold text-gray-800 tracking-wider">
              Where
            </div>
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full bg-transparent border-none outline-none text-gray-600 placeholder-gray-400 text-sm truncate"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleDestinationSubmit}
              autoFocus
            />
            {destination && activeField === "DESTINATION" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDestination("");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="h-8 w-1px bg-gray-200"></div>

          {/* 2. Check-in Selector */}
          <div
            onClick={() => setActiveField("CHECK_IN")}
            className={`
              relative px-6 py-3.5 rounded-full cursor-pointer hover:bg-gray-100 transition min-w-[140px]
              ${activeField === "CHECK_IN" ? "bg-white shadow-lg z-20" : ""}
            `}
          >
            <div className="text-xs font-bold text-gray-800 tracking-wider">
              Check in
            </div>
            <div
              className={`text-sm truncate ${
                checkIn ? "text-gray-900 font-medium" : "text-gray-400"
              }`}
            >
              {formatDate(checkIn)}
            </div>
          </div>

          <div className="h-8 w-1px bg-gray-200"></div>

          {/* 3. Check-out Selector */}
          <div
            onClick={() => {
              if (!checkIn) {
                setActiveField("CHECK_IN");
              } else {
                setActiveField("CHECK_OUT");
              }
            }}
            className={`
              relative px-6 py-3.5 rounded-full cursor-pointer hover:bg-gray-100 transition min-w-[140px]
              ${activeField === "CHECK_OUT" ? "bg-white shadow-lg z-20" : ""}
            `}
          >
            <div className="text-xs font-bold text-gray-800 tracking-wider">
              Check out
            </div>
            <div
              className={`text-sm truncate ${
                checkOut ? "text-gray-900 font-medium" : "text-gray-400"
              }`}
            >
              {formatDate(checkOut)}
            </div>
          </div>

          {/* 4. Search Button */}
          <div className="pl-4 pr-2">
            <button
              onClick={handleSearch}
              className={`
                 flex items-center justify-center gap-2 rounded-full border-radius transition-all duration-300 
                 ${
                   checkOut && destination
                     ? "w-12 h-12 rounded-full bg-[#00b894] hover:bg-[#009688] shadow-md flex items-center justify-center"
                     : "w-12 h-12 rounded-full bg-[#00b894] hover:bg-[#009688] flex items-center justify-center"
                 }
              `}
            >
              <Search size={18} className="text-white stroke-[3px]" />
              {checkOut && destination && (
                <span className="text-white font-bold text-sm animate-in fade-in slide-in-from-right-2 duration-300"></span>
              )}
            </button>
          </div>
        </div>

        {/* --- Calendar Popover --- */}
        {(activeField === "CHECK_IN" || activeField === "CHECK_OUT") && (
          <div className="absolute top-full left-0 mt-4 w-full flex justify-center md:justify-start md:pl-[250px] z-30">
            <CalendarPicker
              currentDate={checkIn || new Date()}
              checkIn={checkIn}
              checkOut={checkOut}
              selecting={activeField}
              onSelect={handleDateSelect}
              onClose={() => setActiveField(null)}
            />
          </div>
        )}

        {/* --- Destination Suggestions (Mock) --- */}
        {activeField === "DESTINATION" && !destination && (
          <div className="absolute top-full left-0 mt-4 bg-white p-6 rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.28)] z-30 w-[350px] animate-in fade-in slide-in-from-top-2">
            <h3 className="text-xs font-bold text-gray-500 mb-2 px-2">
              RECENT SEARCHES
            </h3>
            {[
              "Adamawa , Yola",
              "Akwa Ibom , Uyo",
              "Delta, Ughelli",
              "Kano , Kano ",
            ].map((place) => (
              <div
                key={place}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl cursor-pointer"
                onClick={() => {
                  setDestination(place);
                  handleDestinationSubmit({ key: "Enter" } as any);
                }}
              >
                <div className="bg-gray-100 p-3 rounded-lg">
                  <MapPin size={18} />
                </div>
                <span className="text-gray-700 font-medium">{place}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
