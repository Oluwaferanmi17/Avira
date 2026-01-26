/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MapPin, Users, X } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";

// Components
import NavBar from "../../../components/Home/NavBar";
import Map from "../../../components/AviraMapCore";
import { Calendar } from "../../../../components/ui/calendar";
import PhotoGallery from "@/app/components/PhotoGallery";
import { withAuth } from "../../../components/withAuth";

// Store
import { useBookingStore } from "@/Store/useBookingStore";
import CustomRangeCalendar from "@/app/components/CustomRangeCalendar";

// --- Types ---
interface DateRange {
  from?: Date;
  to?: Date;
}

interface StayType {
  id: string;
  title: string;
  description: string;
  photos: string[];
  amenities: string[];
  pricing?: { basePrice: number; cleaningFee: number; serviceFee: number };
  address?: { city: string; country: string; line1: string };
}

// --- Helper for Currency ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

function StayDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const booking = useBookingStore((state) => state.booking);

  const [stay, setStay] = useState<StayType | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState<number>(2);
  const [note, setNote] = useState<string>("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Refs for click outside logic
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    if (!id) return;
    const fetchStay = async () => {
      try {
        const res = await fetch(`/api/stays/${id}`);
        if (!res.ok) throw new Error("Failed to fetch stay");
        const data = await res.json();
        setStay(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStay();
  }, [id]);

  // 2. Click Outside & Escape Key Listener for Calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCalendar(false);
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCalendar]);

  // 3. Calculations
  const nights = useMemo(() => {
    if (range?.from && range?.to) {
      return Math.max(0, differenceInCalendarDays(range.to, range.from));
    }
    return 0;
  }, [range]);

  const cost = useMemo(() => {
    if (!stay) return { subtotal: 0, cleaning: 0, service: 0, total: 0 };
    const subtotal = nights * (stay.pricing?.basePrice || 0);
    const cleaning = stay.pricing?.cleaningFee || 0;
    const service = stay.pricing?.serviceFee || 0;
    const total = subtotal + cleaning + service;
    return { subtotal, cleaning, service, total };
  }, [nights, stay]);

  // 4. Handlers
  const handleBookNow = () => {
    if (!stay || !range?.from || !range?.to || nights <= 0) return;

    useBookingStore.getState().setBooking({
      reservationId: crypto.randomUUID(),
      type: "stay",
      item: {
        id: stay.id,
        title: stay.title,
        location: stay.address?.city,
        pricePerNight: stay.pricing?.basePrice || 0,
      },
      stay: {
        id: stay.id,
        title: stay.title,
        description: stay.description,
        photos: stay.photos,
        amenities: stay.amenities,
        pricePerNight: stay.pricing?.basePrice || 0,
        address: stay.address,
      },
      dates: {
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        nights,
      },
      guests,
      note,
      cost: cost,
      createdAt: new Date().toISOString(),
    });

    setSummaryOpen(true);
  };

  const proceedToConfirmation = async () => {
    if (!session) {
      alert("You must be logged in to book"); // Consider using toast here
      return;
    }

    // Re-verify store data integrity
    const currentBooking = useBookingStore.getState().booking;

    if (
      !currentBooking ||
      currentBooking.type !== "stay" ||
      !currentBooking.stay ||
      !currentBooking.dates
    ) {
      alert("Booking data is incomplete. Please try again.");
      return;
    }

    try {
      const res = await fetch("/api/bookingStay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user?.id,
          stayId: currentBooking.stay.id,
          checkIn: currentBooking.dates.checkIn,
          checkOut: currentBooking.dates.checkOut,
          guests: currentBooking.guests,
          note: currentBooking.note,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Booking failed");
      }

      const newBooking = await res.json();

      // Update store with DB ID
      useBookingStore.getState().setBooking({
        ...currentBooking,
        dbId: newBooking.id,
      });

      router.push(`/booking/confirm/${newBooking.id}`);
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      alert(err.message);
    }
  };

  const bookDisabled = !range?.from || !range?.to || nights <= 0;

  // 5. Loading State UI
  if (loading || !stay) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-slate-200 w-1/3 rounded mb-4"></div>
          <div className="h-64 bg-slate-200 w-full rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-32 bg-slate-200 rounded-xl"></div>
              <div className="h-32 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="lg:col-span-4 h-64 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {stay.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-700">
              <div className="inline-flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />{" "}
                {stay.address
                  ? `${stay.address.line1}, ${stay.address.city}, ${stay.address.country}`
                  : "No location"}
              </div>
              <span className="text-slate-300">|</span>
              <div className="inline-flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {guests} guests allowed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Details */}
            <section className="lg:col-span-8 space-y-8">
              <PhotoGallery photos={stay.photos} />

              <div className="space-y-6">
                <div className="py-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold mb-3">
                    About this place
                  </h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {stay.description}
                  </p>
                </div>

                <div className="py-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {stay.amenities?.length ? (
                      stay.amenities.map((a) => (
                        <span
                          key={a}
                          className="text-sm px-4 py-2 rounded-lg border border-slate-100 bg-slate-50 text-slate-700"
                        >
                          {a}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">
                        No amenities listed.
                      </p>
                    )}
                  </div>
                </div>

                <div className="py-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Where you’ll be
                  </h2>
                  <p className="mb-4 text-slate-600">
                    {stay.address
                      ? `${stay.address.line1}, ${stay.address.city}`
                      : "Address available after booking"}
                  </p>
                  <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200">
                    <Map />
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Booking Widget */}
            <aside className="lg:col-span-4 relative">
              <div className="sticky top-24 rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {formatCurrency(stay.pricing?.basePrice || 0)}
                    </span>
                    <span className="text-sm text-slate-600"> / night</span>
                  </div>
                </div>

                {/* Date Picker Input */}
                <div className="relative" ref={calendarContainerRef}>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                    Dates
                  </label>
                  <div
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-700 cursor-pointer hover:border-slate-400 transition-colors flex items-center justify-between"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <span>
                      {range?.from
                        ? `${format(range.from, "MMM dd")} ${
                            range.to ? `- ${format(range.to, "MMM dd")}` : ""
                          }`
                        : "Check-in - Check-out"}
                    </span>
                  </div>

                  {showCalendar && (
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                      {/* USE YOUR NEW COMPONENT HERE */}
                      <CustomRangeCalendar
                        value={range}
                        onChange={(val) => setRange(val)}
                      />
                    </div>
                  )}
                </div>

                {/* Guest Counter */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                    Guests
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2">
                    <span className="text-sm text-slate-700">
                      {guests} {guests > 1 ? "guests" : "guest"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:border-slate-800 disabled:opacity-50"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                      >
                        –
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 hover:border-slate-800 disabled:opacity-50"
                        onClick={() => setGuests((g) => Math.min(10, g + 1))} // Cap at 10 or stay capacity
                        disabled={guests >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                    Note to host (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="I'll be arriving around 2pm..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-500"
                  />
                </div>

                {/* Cost Breakdown */}
                {nights > 0 && (
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-slate-600 text-sm">
                      <span className="underline">
                        {formatCurrency(stay.pricing?.basePrice || 0)} ×{" "}
                        {nights} nights
                      </span>
                      <span>{formatCurrency(cost.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-sm">
                      <span className="underline">Cleaning fee</span>
                      <span>{formatCurrency(cost.cleaning)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-sm">
                      <span className="underline">Service fee</span>
                      <span>{formatCurrency(cost.service)}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(cost.total)}</span>
                    </div>
                  </div>
                )}

                <button
                  className={`w-full py-3.5 rounded-lg text-white font-semibold transition-all ${
                    bookDisabled
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-[#00b894] hover:bg-[#019678] active:scale-[0.98]"
                  }`}
                  disabled={bookDisabled}
                  onClick={handleBookNow}
                >
                  {bookDisabled ? "Select dates" : "Reserve"}
                </button>

                <div className="text-center text-xs text-slate-500">
                  You won’t be charged yet
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {summaryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Trip</h2>
              <button
                onClick={() => setSummaryOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Dates
                  </p>
                  <p className="font-medium text-slate-900">
                    {range?.from && range?.to
                      ? `${format(range.from, "MMM d")} – ${format(
                          range.to,
                          "MMM d, yyyy",
                        )}`
                      : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Guests
                  </p>
                  <p className="font-medium text-slate-900">{guests} guests</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total (NGN)</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(cost.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                className="flex-1 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
                onClick={() => setSummaryOpen(false)}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 text-sm font-semibold bg-[#00b894] text-white rounded-xl hover:bg-[#019678]"
                onClick={() => {
                  setSummaryOpen(false);
                  proceedToConfirmation();
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(StayDetails);
