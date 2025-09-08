"use client";
import { useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
// import GoogleMapComponent from "@/app/components/GoogleMapComponent";
interface DateRange {
  from?: Date;
  to?: Date;
}
const stay = {
  title: "Avira Demo Stay",
  location: "Somewhere in Africa",
  pricePerNight: 15000,
  tags: ["Near cultural center"],
  images: [
    "https://pub-cdn.sider.ai/u/U0W8H749A1J/web-coder/6896f83c14f019f2a83eb929/resource/cb3ee8af-cb64-4ad1-bc1c-099af9522301.jpg",
    "https://pub-cdn.sider.ai/u/U0W8H749A1J/web-coder/6896f83c14f019f2a83eb929/resource/432aaceb-bf1f-4ec5-b076-2b6e06e87927.jpg",
    "https://pub-cdn.sider.ai/u/U0W8H749A1J/web-coder/6896f83c14f019f2a83eb929/resource/be00d042-d390-475f-88e8-cbdf23bca156.jpg",
  ],
  description:
    "Sample listing demonstrating the Avira booking flow. Choose dates and guests to continue.",
  amenities: ["Wi‑Fi", "Kitchen", "Air conditioning"],
};
export default function StayDetails() {
  const router = useRouter();
  const [range, setRange] = useState<DateRange>({});
  const [guests, setGuests] = useState<number>(2);
  const [note, setNote] = useState<string>("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const nights = useMemo(() => {
    if (range.from && range.to) {
      return Math.max(0, differenceInCalendarDays(range.to, range.from));
    }
    return 0;
  }, [range]);
  const cost = useMemo(() => {
    const subtotal = nights * stay.pricePerNight;
    const cleaning = nights > 0 ? 20 : 0;
    const service = nights > 0 ? 10 : 0;
    const total = subtotal + cleaning + service;
    return { subtotal, cleaning, service, total };
  }, [nights]);
  function proceedToConfirmation() {
    if (!range.from || !range.to || nights <= 0) return;
    const setBooking = useBookingStore.getState().setBooking;
    setBooking({
      reservationId: "",
      stay: {
        id: stay.id,
        price: stay.pricePerNight,
        title: stay.title,
        location: stay.location,
        pricePerNight: stay.pricePerNight,
        tags: stay.tags,
        images: stay.images,
        description: stay.description,
        amenities: stay.amenities,
      },
      dates: {
        checkIn: range.from.toISOString(),
        checkOut: range.to.toISOString(),
        nights,
      },
      guests,
      cost,
      createdAt: new Date().toISOString(),
      note,
    });
    router.push(`/booking/confirm`);
  }
  function handleBookNow() {
    if (!range.from || !range.to || nights <= 0) return;
    setSummaryOpen(true);
  }
  const bookDisabled = !range.from || !range.to || nights <= 0;
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title & Location */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {stay.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-700">
              <div className="inline-flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" /> {stay.location}
              </div>
              <div className="text-sm">•</div>
              <div className="inline-flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" /> Up to 4 guests
              </div>
              {stay.tags && stay.tags.length > 0 && (
                <>
                  <div className="text-sm">•</div>
                  <div className="flex flex-wrap gap-2">
                    {stay.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 h-64 rounded-xl overflow-hidden">
                  <img
                    src={stay.images[0]}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="h-31 rounded-xl overflow-hidden">
                    <img
                      src={stay.images[1]}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="h-31 rounded-xl overflow-hidden">
                    <img
                      src={stay.images[2]}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">About this place</h2>
                <p className="text-slate-700">{stay.description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">Amenities</h2>
                <div>
                  {stay.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-sm px-3 py-1 rounded-full border border-slate-200 bg-slate-50"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">Where you’ll be</h2>
                <p className="mt-2">{stay.location}</p>
                {/* <div className="flex flex-wrap gap-2">
                  <GoogleMapComponent lat={6.5244} lng={3.3792} />{" "}
                </div> */}
              </div>
            </section>
            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-white sticky top-24 space-y-4">
                <div>
                  <div className="text-2xl font-semibold">
                    ₦{stay.pricePerNight}
                  </div>
                  <div className="text-sm text-slate-600">/ night</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Dates
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      range.from && range.to
                        ? `${format(range.from, "PP")} → ${format(
                            range.to,
                            "PP"
                          )}`
                        : "Add dates"
                    }
                    onClick={() => {
                      const start = prompt("Enter check-in date (YYYY-MM-DD)");
                      const end = prompt("Enter check-out date (YYYY-MM-DD)");
                      if (start && end) {
                        setRange({ from: new Date(start), to: new Date(end) });
                      }
                    }}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Guests
                  </label>
                  <div className="mt-1 flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                    <div className="inline-flex items-center gap-2 text-slate-700">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">
                        {guests} {guests > 1 ? "guests" : "guest"}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="h-8 px-2 border rounded-md bg-transparent"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      >
                        –
                      </button>
                      <button
                        className="h-8 px-2 border rounded-md bg-transparent"
                        onClick={() => setGuests((g) => Math.min(6, g + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Note to host (optional)
                  </label>
                  <textarea
                    placeholder="e.g., Arriving late due to flight."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  />
                </div>
                <div className="rounded-md border border-slate-200 p-3 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">
                      ₦{stay.pricePerNight} × {nights || 0} night
                      {nights === 1 ? "" : "s"}
                    </span>
                    <span className="font-medium">₦{cost.subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Cleaning fee</span>
                    <span className="font-medium">₦{cost.cleaning}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Service fee</span>
                    <span className="font-medium">₦{cost.service}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{cost.total}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    You won’t be charged yet (demo).
                  </div>
                </div>
                <button
                  className={`w-full py-2 rounded-md text-white ${
                    bookDisabled
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-[#00b894] hover:bg-[#018c71]"
                  }`}
                  disabled={bookDisabled}
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      {summaryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
            <h2 className="text-lg font-semibold">Booking Summary</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Check-in</span>
                <span className="font-medium">
                  {range.from ? format(range.from, "PP") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Check-out</span>
                <span className="font-medium">
                  {range.to ? format(range.to, "PP") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Guests</span>
                <span className="font-medium">{guests}</span>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="font-semibold">₦{cost.total}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded-md bg-transparent"
                onClick={() => setSummaryOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#00b894] text-white rounded-md hover:bg-[#018c71]"
                onClick={() => {
                  setSummaryOpen(false);
                  proceedToConfirmation();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
