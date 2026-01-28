"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
// import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  // Tag,
  Ticket,
  Heart,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
// Components
import NavBar from "@/app/components/Home/NavBar";
// import Footer from "@/app/components/Footer"; // Assuming you have this, or remove if not
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { withAuth } from "@/app/components/withAuth";

// --- Types ---

interface EventType {
  id: number;
  title: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  dateStart: string;
  dateEnd: string;
  photos: string[];
  ticketPrice: number;
  category?: string; // Optional if not in your DB yet
}

// --- Helper for Currency ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- Main Component ---

function EventFlow() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const setBooking = useBookingStore((s) => s.setBooking);
  const { data: session } = useSession();

  // Booking State
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tickets, setTickets] = useState<number>(2);
  const [openSummary, setOpenSummary] = useState(false);

  // --- Fetch Logic ---
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);

        // Pre-select the start date if available
        if (data.dateStart) {
          setDate(new Date(data.dateStart));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // --- Derived State ---

  const locationStr = event ? `${event.city}, ${event.country}` : "";
  // const nearby = useMemo(
  //   () => (event ? getNearbyStays(event.country) : []),
  //   [event],
  // );

  // Handle Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // Handle Not Found
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        Event not found
      </div>
    );
  }

  // Fallback images if API returns empty array
  const displayImages =
    event.photos && event.photos.length > 0
      ? event.photos
      : ["/placeholder-event.jpg"]; // Ensure you have a placeholder or use a random URL

  // Pricing calculations
  const price = event.ticketPrice || 0;
  const subtotal = tickets * price;
  const serviceFee = tickets > 0 ? 5 : 0; // Hardcoded service fee for demo
  const total = subtotal + serviceFee;
  const bookDisabled = !date || tickets <= 0;

  /** Proceed to booking confirm */
  async function proceed() {
    if (!date || tickets <= 0 || !event) return;
    if (!session?.user?.id) {
      alert("You must be logged in to book");
      return;
    }
    const res = await fetch("/api/bookingEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "TEMP_USER_ID", // replace with session user id
        eventId: event.id,
        tickets,
      }),
    });

    if (!res.ok) {
      alert("Failed to create booking");
      return;
    }

    const data = await res.json();

    setBooking({
      reservationId: data.id,
      dbId: data.id,
      userId: session?.user?.id,
      type: "event",

      item: {
        id: data.event.id,
        title: data.event.title,
        location: data.event.location,
        price: data.event.ticketPrice,
      },

      event: {
        id: data.event.id,
        title: data.event.title,
        location: data.event.location,
        dateStart: data.event.dateStart,
        dateEnd: data.event.dateEnd,
        image: data.event.image,
      },

      tickets,

      schedule: {
        date: data.event.dateStart,
      },

      cost: {
        subtotal: data.subtotal,
        service: data.service,
        total: data.total,
      },

      createdAt: data.createdAt,
    });
    // const booking = await res.json();
    router.push(`/booking/confirm/${data.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-[36vh] sm:h-[44vh] lg:h-[54vh] overflow-hidden bg-slate-100">
          <img
            src={displayImages[0]}
            alt={event.title}
            className="object-cover w-full h-full"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/1200x600?text=Event+Image")
            }
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-white drop-shadow-md">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {event.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-white/90">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" /> {event.venue}, {event.city}
                  </span>
                  <span className="text-sm opacity-60">•</span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="h-4 w-4" />{" "}
                    {format(new Date(event.dateStart), "PPP")}
                  </span>
                  {event.category && (
                    <>
                      <span className="text-sm opacity-60">•</span>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-none"
                      >
                        {event.category}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details */}
          <section className="lg:col-span-8 space-y-8">
            {/* Navigation Strip */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            </div>

            {/* Gallery Grid (if more than 1 image) */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayImages.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-xl overflow-hidden bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i}`}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description Card */}
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-lg">About this event</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>

                {/* Auto-generated tips (Static for UI feel) */}
                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">
                    Need to know
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Venue: {event.venue}</li>
                    <li>
                      Start Time: {format(new Date(event.dateStart), "p")}
                    </li>
                    <li>
                      Tickets are non-refundable within 24 hours of event.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Right Column: Sticky Booking Widget */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="sticky top-24 border-slate-200 shadow-md">
              <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center justify-between">
                  <span>Book tickets</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {price > 0 ? `₦${price}` : "Free"}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 pt-5">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full text-left rounded-md border border-slate-200 bg-white px-3 py-2.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                        <div className="flex items-center gap-2 text-slate-700">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">
                            {date ? format(date, "PPP") : "Select date"}
                          </span>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Ticket Counter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Quantity
                  </label>
                  <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Ticket className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium">
                        {tickets} {tickets === 1 ? "ticket" : "tickets"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setTickets((t) => Math.max(1, t - 1))}
                      >
                        -
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setTickets((t) => Math.min(10, t + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      ₦{price} × {tickets}
                    </span>
                    <span>₦{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Service fee</span>
                    <span>₦{serviceFee}</span>
                  </div>
                  <div className="my-2 h-px bg-slate-200" />
                  <div className="flex justify-between font-bold text-slate-900 text-base">
                    <span>Total</span>
                    <span>₦{total}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#00b894] hover:bg-[#00a383] text-white h-11 text-base font-medium shadow-sm"
                  disabled={bookDisabled}
                  onClick={() => setOpenSummary(true)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* <Footer /> */}

      {/* Confirmation Modal */}
      <Dialog open={openSummary} onOpenChange={setOpenSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-md bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={displayImages[0]}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                <p className="text-sm text-slate-500">
                  {format(new Date(event.dateStart), "PPP")}
                </p>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tickets ({tickets})</span>
              <span className="font-medium">₦{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Fees</span>
              <span className="font-medium">₦{serviceFee}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
              <span>Total</span>
              <span>₦{total}</span>
            </div>
          </div>
          <DialogFooter className="flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => setOpenSummary(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-[#00b894] hover:bg-[#00a383]"
              onClick={proceed}
            >
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(EventFlow);
