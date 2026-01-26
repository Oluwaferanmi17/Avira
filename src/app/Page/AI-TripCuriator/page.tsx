"use client";
import { useState } from "react";
import TripForm from "../../components/trip-planner/TripForm";
import ItineraryDisplay from "../../components/trip-planner/ItineraryDisplay";
import { TripPreferences, Itinerary } from "../../../types/trip-planner";
import NavBar from "@/app/components/Home/NavBar";
export default function TripPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const generateItinerary = async (preferences: TripPreferences) => {
    setIsLoading(true);
    setItinerary(null);

    try {
      const res = await fetch("/api/planTrip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) throw new Error("Failed to generate itinerary");

      const data = await res.json();

      // The backend should return something like { itinerary: { ... } }
      setItinerary(data.itinerary || data);
    } catch (error) {
      console.error(error);
      alert("There was a problem generating your itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
    //   const res = await fetch("/api/planTrip", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       destination: "Lagos, Nigeria",
    //       travelStyle: "Luxury",
    //       duration: 5,
    //       budget: 300000,
    //       vibe: "Beach, parties, relaxation",
    //     }),
    //   });
    //   const itinerary = await res.json();
    //   setItinerary(itinerary);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              AI Trip Curator
            </h1>
            <p className="text-xl text-slate-600 mt-4">
              Tell Avira your vibe and it plans your trip
            </p>
            <p className="text-slate-500 mt-2">
              Get personalized itineraries with the best stays, events, and
              experiences
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Trip Form */}
            <div className="space-y-6">
              <TripForm onSubmit={generateItinerary} isLoading={isLoading} />
            </div>

            {/* Itinerary Display */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">
                    AI is crafting your perfect itinerary...
                  </p>
                </div>
              ) : itinerary ? (
                <ItineraryDisplay itinerary={itinerary} />
              ) : (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Your Personalized Itinerary Awaits
                  </h3>
                  <p className="text-slate-600">
                    Fill out the form to get AI-curated travel plans with stays,
                    events, and experiences tailored to your preferences.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
