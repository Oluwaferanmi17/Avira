"use client";

import { useState, useEffect, useMemo } from "react";
import { MapPin, Calendar, Heart, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "../../components/Home/NavBar";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import HeartButton from "@/app/components/Heart";

// --- 1. Types & Interfaces ---
interface EventData {
  id: string;
  title: string;
  venue?: string;
  city?: string;
  country?: string;
  dateStart: string;
  dateEnd: string;
  description: string;
  attendees?: number;
  photos: string[];
  category: string;
  location?: string;
}

// --- 2. Skeleton Loader Component (Pure Tailwind) ---
const EventCardSkeleton = () => (
  <div className="max-w-sm bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg flex flex-col h-full">
    {/* Image Area Skeleton */}
    <div className="relative h-48 w-full bg-gray-200 animate-pulse">
      {/* Simulate badge and heart button positions */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full" />
      <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-full" />
    </div>

    {/* Content Skeleton */}
    <div className="p-4 flex flex-col flex-1 space-y-4">
      {/* Title */}
      <div className="h-7 bg-gray-200 rounded w-3/4 animate-pulse" />

      {/* Metadata Row (Location & Date) */}
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>

      {/* Description Lines (Multi-line) */}
      <div className="space-y-2 py-2">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse" />
      </div>

      {/* Footer (Attendees) */}
      <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse mt-auto" />

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded-md w-full animate-pulse mt-2" />
    </div>
  </div>
);

// --- 3. Main Component ---
const Events = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = event.title ?? "";
      const location = `${event.venue ?? ""} ${event.city ?? ""} ${
        event.country ?? ""
      }`;
      const searchLower = search.toLowerCase();
      return (
        title.toLowerCase().includes(searchLower) ||
        location.toLowerCase().includes(searchLower)
      );
    });
  }, [events, search]);

  const handleAddToTrip = (event: EventData) => {
    setBooking({
      type: "event",
      item: {
        id: event.id,
        title: event.title,
        location: event.venue || event.location || "Unknown Location",
      },
      schedule: { date: event.dateStart },
      tickets: 1,
      cost: { subtotal: 0, service: 0, total: 0 },
      reservationId: "",
      createdAt: new Date().toISOString(),
      dates: { checkIn: "", checkOut: "", nights: 0 },
    });
    router.push(`/booking/eventflow/${event.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date TBD";
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-orange-50">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-linear-to-br from-green-500 via-white to-orange-500 text-[#00b894] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl text-[#00b894] font-bold text-center mb-2">
            Upcoming Cultural Events
          </h1>
          <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
            Experience Nigeria&apos;s rich heritage through vibrant festivals
            and cultural celebrations
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="shadow-lg bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 bg-white">
          <div className="p-3">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Search events by name or location..."
                  className="pl-9 flex-1 w-full h-10 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="bg-[#00b894] hover:bg-[#019074] w-full md:w-auto">
                Search Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          {/* Hide count while loading to avoid "0 events found" flashing */}
          {!isLoading && (
            <p className="text-muted-foreground">
              {filteredEvents.length} events found
            </p>
          )}
        </div>

        {/* LOADING STATE: Show Grid of Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create an array of 6 undefined items to map over */}
            {[...Array(6)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">
              No events found matching &quot;{search}&quot;
            </p>
            <Button
              variant="link"
              onClick={() => setSearch("")}
              className="text-[#00b894]"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          /* DATA STATE: Show Actual Events */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="max-w-sm bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <HeartButton
                    itemId={event.id}
                    type="event"
                    className="absolute top-3 right-3 z-20"
                  />
                  <img
                    src={event.photos[0] || "/placeholder-event.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#00b894] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {event.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h2
                    className="text-xl font-bold text-gray-800 line-clamp-1"
                    title={event.title}
                  >
                    {event.title}
                  </h2>
                  <div className="flex items-center text-gray-600 space-x-4 mt-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span className="text-sm line-clamp-1">
                        {event.venue}, {event.city}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 shrink-0" />
                      <span className="text-sm shrink-0">
                        {formatDate(event.dateStart)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mt-3 line-clamp-3 mb-4 flex-1">
                    {event.description}
                  </p>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Users size={16} className="text-gray-500 mr-1" />
                    <span>
                      {event.attendees ? event.attendees.toLocaleString() : "—"}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleAddToTrip(event)}
                    className="w-full bg-[#00b894] text-white text-sm font-medium py-2 rounded-md hover:bg-[#019174] transition mt-auto"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Trip Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Events;
