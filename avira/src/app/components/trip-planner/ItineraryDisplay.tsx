import { useState } from "react";
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

  /**
   * Handle booking the entire trip
   */
  const handleBookTrip = () => {
    setShowSummary(true);
    console.log("Booking trip:", itinerary);
  };

  if (showSummary) {
    return (
      <TripSummary itinerary={itinerary} onBack={() => setShowSummary(false)} />
    );
  }
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-slate-900">
                Your {itinerary.duration}-Day {itinerary.destination} Itinerary
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Tailored for {itinerary.travelStyle} travel • Budget: ₦
                {formatCurrency(itinerary.budget)}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-white text-emerald-700 border-emerald-200"
            >
              AI Curated
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>
                  💰 Total Cost:{" "}
                  <strong>{formatCurrency(itinerary.budget)}</strong>
                </span>
                <span>📅 {itinerary.duration} days</span>
                <span>👥 {itinerary.travelStyle}</span>
              </div>
            </div>

            <Button
              onClick={handleBookTrip}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
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
              Book Entire Trip
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: itinerary.duration }, (_, i) => i + 1).map(
          (day) => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                currentDay === day
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Day {day}
            </button>
          )
        )}
      </div>

      <DayCard
        day={itinerary.days.find((d) => d.day === currentDay)!}
        dayNumber={currentDay}
      />

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => setCurrentDay((prev) => Math.max(1, prev - 1))}
          disabled={currentDay === 1}
        >
          ← Previous Day
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() =>
            setCurrentDay((prev) => Math.min(itinerary.duration, prev + 1))
          }
          disabled={currentDay === itinerary.duration}
        >
          Next Day →
        </Button>
      </div>
    </div>
  );
}
