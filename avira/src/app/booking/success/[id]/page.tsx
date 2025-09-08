"use client";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { CalendarDays, CheckCircle2, MapPin, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useBookingStore } from "@/Store/useBookingStore";
import Link from "next/link";
export default function BookingSuccess() {
  const params = useParams();
  const booking = useBookingStore((state) => state.booking);
  const reservationId = booking?.reservationId || params.id || "AVR-UNKNOWN";
  const from = booking?.dates?.checkIn
    ? parseISO(booking.dates.checkIn)
    : undefined;
  const to = booking?.dates?.checkOut
    ? parseISO(booking.dates.checkOut)
    : undefined;
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Booking confirmed
              </h1>
              <p className="text-slate-600 mt-1">
                Your reservation has been placed successfully.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow p-4">
            <div className="pb-2 border-slate-100 mb-3">
              <h2 className="text-lg font-semibold">Reservation details</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Reservation ID:{" "}
                <span className="font-semibold">{reservationId}</span>
              </div>
              <div>
                <div className="text-slate-900 font-medium">
                  {booking?.item?.title || "Your stay"}
                </div>
                {booking?.item?.location ? (
                  <div className="text-sm text-slate-600 inline-flex items-center gap-1 mt-0.5">
                    <MapPin className="h-4 w-4" /> {booking.item.location}
                  </div>
                ) : null}
              </div>
              <div className="text-sm text-slate-700">
                {from && to ? (
                  <div className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    {format(from, "PP")} → {format(to, "PP")} (
                    {booking?.dates?.nights} night
                    {booking?.dates?.nights === 1 ? "" : "s"})
                  </div>
                ) : null}
                {typeof booking?.guests === "number" ? (
                  <div className="mt-1 inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    {booking.guests} {booking.guests > 1 ? "guests" : "guest"}
                  </div>
                ) : null}
              </div>
              {booking?.cost ? (
                <div className="rounded-md border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Subtotal</span>
                    <span className="font-medium">
                      ₦{booking.cost.subtotal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-700">Cleaning fee</span>
                    <span className="font-medium">
                      ₦{booking.cost.cleaning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-700">Service fee</span>
                    <span className="font-medium">₦{booking.cost.service}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">₦{booking.cost.total}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/Page/trips">
              <button className="w-full sm:w-auto rounded-2xl bg-[#00b894] px-4 py-2 text-white font-medium shadow hover:bg-[#018c71]">
                Go to Your Trips
              </button>
            </Link>
            <Link href="/">
              <button className="w-full sm:w-auto rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50">
                Back to Home
              </button>
            </Link>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            A confirmation email with your reservation details has been sent
            (demo).
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
