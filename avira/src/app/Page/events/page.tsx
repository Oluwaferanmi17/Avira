/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Heart, Users } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NavBar from "../../components/Home/NavBar";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import { getEvents } from "@/app/actions/getEvent";
import HeartButton from "@/app/components/Heart";
const Events = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);
  const filteredEvents = events.filter((event) => {
    const title = event.title ?? "";
    const location = `${event.venue ?? ""} ${event.city ?? ""} ${
      event.country ?? ""
    }`;
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase())
    );
  });
  // const formatDate = (dateStr: string | null) =>
  //   dateStr
  //     ? new Date(dateStr).toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //         year: "numeric",
  //       })
  //     : "—";
  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
    }
    fetchEvents();
  }, []);
  const handleAddToTrip = (event: any) => {
    setBooking({
      type: "event",
      item: {
        id: event.id,
        title: event.title,
        location: event.location,
      },
      schedule: { date: event.dateStart },
      tickets: 1, // default
      cost: {
        subtotal: 0,
        service: 0,
        total: 0,
      },
      reservationId: "",
      createdAt: new Date().toISOString(),
      dates: { checkIn: "", checkOut: "", nights: 0 },
    });
    router.push(`/booking/eventflow/${event.id}`);
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <NavBar />
      <div className="bg-gradient-to-br from-green-500 via-white to-orange-500 text-[#00b894] py-16">
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
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="shadow-lg bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
          <div className="p-3">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                placeholder="Search events by name or location..."
                className="flex-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-white bg-[#00b894] hover:bg-[#019074] h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5">
                Search Events
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Event Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <p className="text-muted-foreground">
            {filteredEvents.length} events found
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="max-w-sm bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <HeartButton
                  itemId={event.id}
                  type="event"
                  className="absolute top-3 right-3 z-20"
                />
                <img
                  src={event.photos[0]}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#00b894] text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                  {event.category}
                </span>
                <div className="absolute top-4 right-4">
                  {/* <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-[#25453f]">
                    {event.stays}
                  </Badge> */}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {event.title}
                </h2>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {event.venue}, {event.city}, {event.country}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {new Date(event.dateStart).toLocaleDateString()} –{" "}
                      {new Date(event.dateEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-3">
                  {event.description}
                </p>
                <div className="flex items-center text-gray-600 text-sm mt-3">
                  <Users size={16} className="text-gray-500 mr-1" />
                  <span>{event.attendees ?? "—"}</span>
                </div>
              </div>
              <div className="p-4">
                <Button
                  onClick={() => handleAddToTrip(event)}
                  className="mt-4 w-full bg-[#00b894] text-white text-sm font-medium py-2 rounded-md hover:bg-[#019174] transition"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Trip Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Events;
