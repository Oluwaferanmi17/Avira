"use client";
import { useRouter } from "next/navigation";
import { useBookingStore } from "../../../Store/useBookingStore";
import {
  MapPin,
  CalendarDays,
  Users,
  ChevronLeft,
  CreditCard,
  Ticket,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
function generateReservationId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.floor(Math.random() * 1e6)
    .toString(36)
    .toUpperCase();
  return `AVR-${ts}-${rnd}`;
}
export default function BookingConfirm() {
  const router = useRouter();
  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);
  const hasItem = !!(booking?.item || booking?.item);
  const hasAnyDate =
    !!(booking?.dates?.checkIn && booking?.dates?.checkOut) ||
    !!booking?.schedule?.date;
  if (!booking || !hasItem || !hasAnyDate) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-2xl border border-slate-200 shadow-sm p-6 bg-white">
              <div className="text-slate-700">No reservation data found.</div>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                onClick={() => router.push("/")}
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  const from = booking.dates?.checkIn ? parseISO(booking.dates.checkIn) : null;
  const to = booking.dates?.checkOut ? parseISO(booking.dates.checkOut) : null;
  const singleDate = booking.schedule?.date
    ? parseISO(booking.schedule.date)
    : null;
  const itemTitle =
    booking.item?.title ?? booking.item?.title ?? "Your booking";
  const itemLocation = booking.item?.location ?? booking.item?.location;
  const handleConfirm = () => {
    const reservationId = generateReservationId();
    setBooking({
      ...booking,
      reservationId,
      createdAt: new Date().toISOString(),
      type: booking.type,
    });
    router.push(`/booking/success/${encodeURIComponent(reservationId)}`);
  };
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="text-xs text-slate-500">
          Booking type: {booking.type}
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-transparent text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <h1 className="text-xl font-semibold">Confirm and pay</h1>
            </div>
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold">Contact information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Full name
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {booking.note ? (
                  <div className="sm:col-span-2 text-xs text-slate-600">
                    Note to host:{" "}
                    <span className="text-slate-800">{booking.note}</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold">Payment method</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="text-sm text-slate-700">
                  Paystack / Flutterwave integration (planned)
                </div>
                <div className="rounded-md border border-slate-200 p-3 text-sm bg-slate-50">
                  <div className="inline-flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Use your card at the next step (demo).</span>
                  </div>
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Confirm and pay
                </button>
              </div>
            </div>
          </section>
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white sticky top-24">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold">Your booking</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="font-medium">{itemTitle}</div>
                  {itemLocation ? (
                    <div className="text-sm text-slate-600 inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {itemLocation}
                    </div>
                  ) : null}
                </div>
                <div className="text-sm text-slate-700">
                  {from && to ? (
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      {format(from, "PP")} → {format(to, "PP")} (
                      {booking.dates?.nights} night
                      {booking.dates?.nights === 1 ? "" : "s"})
                    </div>
                  ) : singleDate ? (
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      {format(singleDate, "PP")}
                    </div>
                  ) : null}
                  {typeof booking.guests === "number" ? (
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      {booking.guests} {booking.guests > 1 ? "guests" : "guest"}
                    </div>
                  ) : null}
                  {typeof booking.tickets === "number" ? (
                    <div className="mt-1 inline-flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-emerald-600" />
                      {booking.tickets}{" "}
                      {booking.tickets > 1 ? "tickets" : "ticket"}
                    </div>
                  ) : null}
                </div>
                <div className="h-px bg-slate-200" />
                {booking.item && booking.dates ? (
                  <div className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">
                        ₦{booking.item.pricePerNight} × {booking.dates.nights}{" "}
                        night
                        {booking.dates.nights === 1 ? "" : "s"}
                      </span>
                      <span className="font-medium">
                        ₦{booking.cost?.subtotal ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-700">Cleaning fee</span>
                      <span className="font-medium">
                        ₦{booking.cost?.cleaning ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-700">Service fee</span>
                      <span className="font-medium">
                        ₦{booking.cost?.service ?? 0}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold">
                        ₦{booking.cost?.total ?? 0}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Subtotal</span>
                      <span className="font-medium">
                        ₦{booking.cost?.subtotal ?? 0}
                      </span>
                    </div>
                    {typeof booking.cost?.cleaning === "number" ? (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-700">Cleaning fee</span>
                        <span className="font-medium">
                          ₦{booking.cost?.cleaning}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-700">Service fee</span>
                      <span className="font-medium">
                        ₦{booking.cost?.service ?? 0}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold">
                        ₦{booking.cost?.total ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
