"use client";
import { useState } from "react";
import CustomCalendar from "./CustomCalendar";
import { FaSearchLocation, FaSearch } from "react-icons/fa";
export default function AnimatedSearchBar() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const goNext = () => setStep((prev) => prev + 1);
  const handleSearch = async () => {
    if (!location || !checkIn || !checkOut) return;
    const params = new URLSearchParams({
      location,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    });
    window.location.href = `/stays?${params.toString()}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 relative z-10">
      <div className="bg-white rounded-full shadow-md flex items-center px-4 py-2 gap-4 relative z-20">
        {/* Step 1: WHERE */}
        {step >= 1 && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 font-semibold">
              <FaSearchLocation className="w-4 h-4" />
              Where
            </label>
            <input
              type="text"
              placeholder="Search"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && location) goNext();
              }}
              className="outline-none text-sm text-gray-800 placeholder:text-gray-400 w-24 sm:w-32 bg-transparent"
            />
          </div>
        )}
        {/* Step 2: CHECK IN */}
        {step >= 2 && (
          <div className="flex flex-1 gap-4">
            <div className="border-l border-gray-200 pl-4 flex-1">
              <CustomCalendar
                label="Check in"
                mode="checkin"
                onSelect={(date) => {
                  setCheckIn(date);
                  goNext();
                }}
              />
            </div>
            {/* Step 3: CHECK OUT */}
            {step >= 3 && (
              <div className="border-l border-gray-200 pl-4 flex-1">
                <CustomCalendar
                  label="Check out"
                  mode="checkout"
                  minDate={checkIn || undefined}
                  onSelect={(date) => {
                    setCheckOut(date);
                  }}
                />
              </div>
            )}
          </div>
        )}
        {/* Search Button */}
        {step >= 3 && (
          <button
            onClick={handleSearch}
            className={`ml-auto bg-[#00b894] hover:bg-[#4f9688] text-white rounded-full p-3 shadow transition ${
              !location || !checkIn || !checkOut
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!location || !checkIn || !checkOut}
          >
            <FaSearch className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
