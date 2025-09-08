/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
const events = [
  {
    id: 1,
    name: "Ojude Oba Festival",
    location: "Ijebu-Ode, Ogun State",
    date: "August 15-17, 2024",
    image: "photo-1466442929976-97f336a657be",
    stays: "12 stays nearby",
    description:
      "A colorful festival celebrating the Awujale of Ijebuland with horsemen, traditional attire, and cultural displays.",
    attendees: "50,000+ expected",
    category: "Cultural Festival",
  },
  {
    id: 2,
    name: "Calabar Carnival",
    location: "Calabar, Cross River",
    date: "December 1-31, 2024",
    image: "photo-1472396961693-142e6e269027",
    stays: "8 stays nearby",
    description:
      "Africa's biggest street party featuring parades, music, dance, and international performances.",
    attendees: "2 million+ expected",
    category: "Street Carnival",
  },
  {
    id: 3,
    name: "Argungu Fishing Festival",
    location: "Argungu, Kebbi State",
    date: "March 10-12, 2025",
    image: "photo-1469041797191-50ace28483c3",
    stays: "5 stays nearby",
    description:
      "Traditional fishing competition on the Argungu River with cultural performances and local cuisine.",
    attendees: "100,000+ expected",
    category: "Traditional Festival",
  },
  {
    id: 4,
    name: "Osun Osogbo Festival",
    location: "Osogbo, Osun State",
    date: "July 25-August 5, 2024",
    image: "photo-1605810230434-7631ac76ec81",
    stays: "15 stays nearby",
    description:
      "Sacred festival honoring the river goddess Osun with rituals, prayers, and cultural celebrations.",
    attendees: "75,000+ expected",
    category: "Religious Festival",
  },
  {
    id: 5,
    name: "New Yam Festival",
    location: "Enugu, Enugu State",
    date: "September 20-22, 2024",
    image: "photo-1465146344425-f00d5f5c8f07",
    stays: "10 stays nearby",
    description:
      "Igbo harvest festival celebrating the yam harvest with traditional dances, music, and feasting.",
    attendees: "30,000+ expected",
    category: "Harvest Festival",
  },
  {
    id: 6,
    name: "Eyo Festival",
    location: "Lagos Island, Lagos",
    date: "November 15-16, 2024",
    image: "photo-1500673922987-e212871fec22",
    stays: "25 stays nearby",
    description:
      "Traditional Lagos festival featuring masqueraders in white flowing robes parading through the streets.",
    attendees: "200,000+ expected",
    category: "Cultural Parade",
  },
];
const Events = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
  );
  const handleAddToTrip = (event: any) => {
    setBooking({
      type: "event",
      item: {
        id: event.id.toString(),
        title: event.name,
        location: event.location,
      },
      schedule: { date: event.date },
      tickets: 1, // default
      cost: {
        subtotal: 0,
        service: 0,
        total: 0,
      },
      reservationId: "",
      createdAt: new Date().toISOString(),
      dates: { checkIn: "", checkOut: "", nights: 0 }, // ✅ required by BookingState
    });
    router.push("/booking/eventflow"); // 👈 go to eventflow
  };

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <div className="bg-gradient-to-r from-green-300 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
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
          <p className="text-muted-foreground">{events.length} events found</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="max-w-sm bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={event.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#00b894] text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                  {event.category}
                </span>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-[#25453f]">
                    {event.stays}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {event.name}
                </h2>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-3">
                  {event.description}
                </p>
                <div className="flex items-center text-gray-600 text-sm mt-3">
                  <Users size={16} className="text-gray-500 mr-1" />
                  <span>{event.attendees}</span>
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
