"use client";

import { Itinerary } from "../../../types/trip-planner";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";

interface TripSummaryProps {
  itinerary: Itinerary;
  onBack: () => void;
}

export default function TripSummary({ itinerary, onBack }: TripSummaryProps) {
  // 🧩 Safe numeric fallbacks
  const totalCost = Number(itinerary.totalCost ?? itinerary.budget ?? 0);

  const accommodationCost = Math.floor(totalCost * 0.3);
  const activityCost = Math.floor(totalCost * 0.5);
  const transportationCost = Math.floor(totalCost * 0.15);
  const miscCost = Math.floor(totalCost * 0.05);

  const handleConfirmBooking = () => {
    alert(
      `Booking confirmed! Your ${itinerary.duration}-day trip to ${itinerary.destination} is being processed.`
    );
  };
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl text-slate-900">
          Ready to Book Your Trip!
        </CardTitle>
        <p className="text-slate-600 mt-2">
          Review your {itinerary.duration}-day {itinerary.destination} itinerary
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trip Overview */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {itinerary.duration}
              </div>
              <div className="text-xs text-slate-500">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalCost)}
              </div>
              <div className="text-xs text-slate-500">Total Cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {itinerary.travelStyle}
              </div>
              <div className="text-xs text-slate-500">Travel Style</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {itinerary.destination}
              </div>
              <div className="text-xs text-slate-500">Destination</div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Accommodation", accommodationCost],
              ["Activities & Experiences", activityCost],
              ["Transportation", transportationCost],
              ["Miscellaneous", miscCost],
            ].map(([label, amount], index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-slate-100"
              >
                <span className="text-slate-700">{label}</span>
                <span className="font-semibold">
                  ₦{Number(amount).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-center py-2 bg-slate-50 rounded-lg px-3">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-lg text-emerald-600">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">What&apos;s Included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                `${itinerary.duration} nights accommodation`,
                "All scheduled activities and experiences",
                "Local transportation between activities",
                "24/7 trip support",
                "Local guide recommendations",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Badge className="w-5 h-5 p-0 flex items-center justify-center bg-emerald-100 text-emerald-700">
                    ✓
                  </Badge>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 bg-transparent"
          >
            ← Back to Itinerary
          </Button>
          <Link href="/booking/confirm" className="flex-1">
            <Button
              onClick={handleConfirmBooking}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              size="lg"
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
              Confirm & Book Trip
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Your card will be charged upon confirmation. Free cancellation
            within 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
// export default TripSummary;s
