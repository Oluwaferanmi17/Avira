/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState, useEffect } from "react";
import NavBar from "../../../components/Home/NavBar";
import { MapPin, Users } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import { withAuth } from "../../../components/withAuth";
import Map from "../../../components/AviraMapCore";
import { Calendar } from "../../../../components/ui/calendar";
import { useSession } from "next-auth/react";
// import GoogleMapComponent from "@/app/components/GoogleMapComponent";
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
import PhotoGallery from "@/app/components/PhotoGallery";
function StayDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [stay, setStay] = useState<StayType | null>(null);
  const booking = useBookingStore((state) => state.booking);
  const [range, setRange] = useState<DateRange>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [guests, setGuests] = useState<number>(2);
  const [note, setNote] = useState<string>("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [, setLoading] = useState(true);
  // const [showAll, setShowAll] = useState(false);
  const { data: session } = useSession();
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
    // if (id) fetchStay();
    fetchStay();
  }, [id]);
  const nights = useMemo(() => {
    if (range.from && range.to) {
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
  if (!stay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  const proceedToConfirmation = async () => {
    // const session = await getServerSession(authOptions);
    if (!session) {
      alert("You must be logged in to book");
      return;
    }
    if (
      !booking ||
      booking.type !== "stay" ||
      !booking.stay ||
      !booking.dates
    ) {
      alert("Booking data is incomplete");
      return;
    }
    try {
      const res = await fetch("/api/bookingStay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id, // logged in user
          stayId: booking.stay.id, // 👈 from store
          checkIn: booking.dates.checkIn,
          checkOut: booking.dates.checkOut,
          guests: booking.guests,
          note: booking.note,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Booking failed");
      }
      const newBooking = await res.json();
      useBookingStore.getState().setBooking({
        ...booking,
        dbId: newBooking.id,
      });
      router.push(`/booking/confirm/${newBooking.id}`);
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      alert(err.message);
    }
  };
  function handleBookNow() {
    if (!stay) return;
    if (!range.from || !range.to || nights <= 0) return;
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
  }
  const bookDisabled = !range.from || !range.to || nights <= 0;
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-2">
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
              <div className="text-sm">•</div>
              <div className="inline-flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {guests} guests
              </div>
              {/* <div className="text-sm">•</div> */}
              {/* <div>{Users?.name}</div> */}
              {/* {stay.tags && stay.tags.length > 0 && (
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
              )} */}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 space-y-6">
              <PhotoGallery photos={stay.photos} />
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">About this place</h2>
                <p className="text-slate-700">{stay.description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">Amenities</h2>
                <div className="space-x-5">
                  {stay.amenities?.length ? (
                    stay.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-sm px-3 py-1 rounded-full border border-slate-200 bg-slate-50 
                        text-blue-500
                      
                        "
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500">No amenities listed.</p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                <h2 className="font-semibold mb-2">Where you’ll be</h2>
                <p className="mt-2">
                  {" "}
                  {stay.address
                    ? `${stay.address.line1}, ${stay.address.city}, ${stay.address.country}`
                    : "No address"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* <GoogleMapComponent lat={6.5244} lng={3.3792} />{" "} */}
                  <Map />
                </div>
              </div>
            </section>
            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-white sticky top-24 space-y-4">
                <div>
                  <div className="text-2xl font-semibold">
                    ₦{stay.pricing?.basePrice || 0}
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
                    required
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer"
                  />
                  {showCalendar && (
                    <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <Calendar
                        mode="range"
                        selected={range as any}
                        onSelect={(v: any) => setRange(v ?? {})}
                        numberOfMonths={2}
                        initialFocus
                      />
                    </div>
                  )}
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
                      ₦{stay.pricing?.basePrice || 0} × {nights || 0} night
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
                      ? "bg-[#85ccbe] cursor-not-allowed"
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
export default withAuth(StayDetails);
