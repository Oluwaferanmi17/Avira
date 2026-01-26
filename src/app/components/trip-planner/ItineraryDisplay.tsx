import { useState, useMemo } from "react";
import { Itinerary } from "../../../types/trip-planner";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import DayCard from "./DayCard";
import TripSummary from "./TripSummary";

interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

/**
 * ItineraryDisplay
 * Shows the complete AI-generated itinerary with booking options
 */
export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const [showSummary, setShowSummary] = useState(false);

  // Memoize currency formatter to prevent recreation on render
  const formattedBudget = useMemo(() => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(itinerary.budget);
  }, [itinerary.budget]);

  // Safe access to the current day's data
  const activeDayData = itinerary.days.find((d) => d.day === currentDay);

  const handleBookTrip = () => {
    setShowSummary(true);
    console.log("Booking trip:", itinerary);
  };

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
    // Optional: Scroll back to top of day card when switching
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSummary) {
    return (
      <TripSummary itinerary={itinerary} onBack={() => setShowSummary(false)} />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Header Card - Improved Mobile Layout */}
      <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-2xl text-slate-900">
                  {itinerary.destination} Adventure
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-white/80 text-emerald-700 border-emerald-200 backdrop-blur-sm"
                >
                  AI Curated
                </Badge>
              </div>
              <p className="text-slate-600">
                {itinerary.duration}-Day Trip • Tailored for{" "}
                {itinerary.travelStyle}
              </p>
            </div>

            {/* Book Button - Visible on Desktop Header */}
            <Button
              onClick={handleBookTrip}
              className="hidden md:flex bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Book Trip
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-emerald-200/50">
            <div className="grid grid-cols-2 sm:flex gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Total Budget
                  </p>
                  <p className="font-bold text-emerald-700">
                    {formattedBudget}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🗓️</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Duration
                  </p>
                  <p className="font-medium">{itinerary.duration} Days</p>
                </div>
              </div>
            </div>

            {/* Mobile Book Button */}
            <Button
              onClick={handleBookTrip}
              className="w-full sm:hidden bg-gradient-to-r from-emerald-600 to-blue-600"
            >
              Book Trip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Day Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 -mx-2 px-2 md:static md:bg-transparent md:p-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {Array.from({ length: itinerary.duration }, (_, i) => i + 1).map(
            (day) => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`snap-start px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  currentDay === day
                    ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                Day {day}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 3. Day Detail Card with Safety Check */}
      <div className="min-h-[400px]">
        {activeDayData ? (
          <DayCard day={activeDayData} dayNumber={currentDay} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-slate-500">
              Information for Day {currentDay} is unavailable.
            </p>
          </div>
        )}
      </div>

      {/* 4. Navigation Footer */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          className="flex-1 hover:bg-slate-50"
          onClick={() => handleDayChange(Math.max(1, currentDay - 1))}
          disabled={currentDay === 1}
        >
          ← Previous Day
        </Button>
        <Button
          variant="outline"
          className="flex-1 hover:bg-slate-50"
          onClick={() =>
            handleDayChange(Math.min(itinerary.duration, currentDay + 1))
          }
          disabled={currentDay === itinerary.duration}
        >
          Next Day →
        </Button>
      </div>
    </div>
  );
}
