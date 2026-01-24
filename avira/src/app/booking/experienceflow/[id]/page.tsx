"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import { format } from "date-fns";
import {
  CalendarDays,
  MapPin,
  ChevronLeft,
  Heart,
  Loader2,
  Clock,
  Star,
  CheckCircle2,
  Users,
} from "lucide-react";

// Components
import NavBar from "@/app/components/Home/NavBar";
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

// --- Types based on your Schema ---

type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

interface ExperienceType {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  rating?: number;
  photos: string[];
  country: string;
  city: string;
  venue?: string;
  highlights: string[];
  availableDays: WeekDay[];
  host?: {
    name: string;
    image?: string; // Assuming host has image
  };
}

// --- Helper: Map WeekDay Strings to JS Date Integers (0-6) ---
const DAY_MAP: Record<WeekDay, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// --- Main Component ---

function ExperienceFlow() {
  const { id } = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceType | null>(null);
  const [loading, setLoading] = useState(true);
  const setBooking = useBookingStore((s) => s.setBooking);

  // Booking State
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(1);
  const [openSummary, setOpenSummary] = useState(false);

  // --- Fetch Logic ---
  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (!res.ok) throw new Error("Experience not found");
        const data = await res.json();
        setExperience(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  // --- Date Logic ---
  // Disable dates that are in the past OR not in the availableDays array
  const isDateDisabled = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (day < today) return true;

    if (experience?.availableDays) {
      const dayIndex = day.getDay(); // 0 (Sun) - 6 (Sat)
      // Check if this index exists in the mapped available days
      const allowedIndices = experience.availableDays.map((d) => DAY_MAP[d]);
      return !allowedIndices.includes(dayIndex);
    }
    return true;
  };

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // --- Render Not Found ---
  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        Experience not found
      </div>
    );
  }

  // Fallback images
  const displayImages =
    experience.photos && experience.photos.length > 0
      ? experience.photos
      : ["/placeholder-experience.jpg"];

  // Pricing calculations
  const price = experience.price || 0;
  const subtotal = guests * price;
  const serviceFee = guests > 0 ? 1000 : 0; // Flat fee or percentage
  const total = subtotal + serviceFee;
  const bookDisabled = !date || guests <= 0;

  /** Proceed to booking confirm */
  async function proceed() {
    if (!date || guests <= 0 || !experience) return;

    const res = await fetch("/api/bookingExperience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId: experience.id,
        date,
        guests,
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

      type: "experience",

      item: {
        id: data.experience.id,
        title: data.experience.title,
        location: data.experience.location,
        price: data.experience.price,
      },

      experience: {
        id: data.experience.id,
        title: data.experience.title,
        location: data.experience.location,
        image: data.experience.images?.[0],
        price: data.experience.price,
        duration: data.experience.duration,
      },

      guests,

      schedule: {
        date: data.date,
      },

      cost: {
        subtotal: data.subtotal,
        service: data.service,
        total: data.total,
      },

      createdAt: data.createdAt,
    });

    router.push(`/booking/confirm/${data.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden bg-slate-100">
          <img
            src={displayImages[0]}
            alt={experience.title}
            className="object-cover w-full h-full"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/1200x600?text=Experience+Image")
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-white drop-shadow-md">
                <Badge className="mb-3 bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                  {experience.category}
                </Badge>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                  {experience.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    {experience.city}, {experience.country}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    {experience.duration}
                  </span>

                  {experience.rating && (
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      {experience.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100"
                >
                  <Heart className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            </div>

            {/* Gallery Grid (if more than 1 image) */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-lg overflow-hidden bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i}`}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* About / Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                About this experience
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {experience.description}
              </p>
            </div>

            {/* Highlights */}
            {experience.highlights && experience.highlights.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  What makes this special
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Host Info (Optional based on schema) */}
            {experience.host && (
              <div className="flex items-center gap-4 py-6 border-t border-b border-slate-100">
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                  {/* Host Image or Fallback */}
                  <div className="h-full w-full flex items-center justify-center bg-emerald-100 text-emerald-800 font-bold">
                    {experience.host.name?.[0] || "H"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Hosted by</p>
                  <p className="font-semibold text-slate-900">
                    {experience.host.name || "Experience Host"}
                  </p>
                </div>
              </div>
            )}

            {/* Venue Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Where you&apos;ll be</h3>
              <p className="text-slate-600 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {experience.venue ? `${experience.venue}, ` : ""}{" "}
                {experience.city}, {experience.country}
              </p>
              {/* Add a Map Component here if you have coordinates */}
            </div>
          </section>

          {/* Right Column: Sticky Booking Widget */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="sticky top-24 border-slate-200 shadow-xl shadow-slate-200/50">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-emerald-600">
                    {price > 0 ? `₦${price.toLocaleString()}` : "Free"}
                  </span>
                  <span className="text-sm font-normal text-slate-500">
                    per person
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={`w-full text-left rounded-lg border px-4 py-3 flex items-center justify-between transition-all ${!date ? "border-slate-300 bg-white" : "border-emerald-500 bg-emerald-50/30"}`}
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays
                            className={`h-5 w-5 ${!date ? "text-slate-400" : "text-emerald-600"}`}
                          />
                          <span
                            className={`text-sm font-medium ${!date ? "text-slate-600" : "text-slate-900"}`}
                          >
                            {date ? format(date, "PPP") : "Check availability"}
                          </span>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={isDateDisabled} // Logic to block non-available weekdays
                        initialFocus
                        className="rounded-md border"
                      />
                      <div className="p-3 bg-slate-50 text-xs text-slate-500 text-center border-t">
                        Available: {experience.availableDays.join(", ")}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Counter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Guests
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Users className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-medium">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-slate-100"
                        onClick={() => setGuests((t) => Math.max(1, t - 1))}
                      >
                        -
                      </Button>
                      <span className="w-4 text-center text-sm font-medium">
                        {guests}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 hover:bg-slate-100"
                        onClick={() => setGuests((t) => Math.min(20, t + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {date && guests > 0 && (
                  <div className="rounded-lg bg-slate-50 p-4 space-y-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        ₦{price.toLocaleString()} × {guests}
                      </span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service fee</span>
                      <span>₦{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="my-2 h-px bg-slate-200" />
                    <div className="flex justify-between font-bold text-slate-900 text-base">
                      <span>Total</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-medium rounded-lg shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98]"
                  disabled={bookDisabled}
                  onClick={() => setOpenSummary(true)}
                >
                  {bookDisabled ? "Select date to book" : "Reserve"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Dialog open={openSummary} onOpenChange={setOpenSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review your trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="h-20 w-24 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={displayImages[0]}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 line-clamp-2">
                  {experience.title}
                </h4>
                <p className="text-sm text-slate-500 mt-1">
                  {date ? format(date, "PPP") : ""}
                </p>
                <p className="text-sm text-slate-500">
                  {experience.duration} • {experience.city}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Guests ({guests})</span>
                <span className="font-medium">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service fee</span>
                <span className="font-medium">
                  ₦{serviceFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                <span>Total (NGN)</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-slate-300"
              onClick={() => setOpenSummary(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-[#00b894] hover:bg-[#00a383] text-white"
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

export default withAuth(ExperienceFlow);
