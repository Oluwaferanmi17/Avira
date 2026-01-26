"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import {
  MapPin,
  CalendarDays,
  Users,
  ChevronLeft,
  CreditCard,
  Ticket,
  Loader2,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import NavBar from "@/app/components/Home/NavBar";
import Footer from "@/app/components/Home/Footer";
import { useState } from "react";

export default function BookingConfirm() {
  const router = useRouter();
  const booking = useBookingStore((state) => state.booking);
  const setBooking = useBookingStore((state) => state.setBooking);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // UI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const hasItem = !!booking?.item;
  const hasAnyDate =
    !!(booking?.dates?.checkIn && booking?.dates?.checkOut) ||
    !!booking?.schedule?.date;

  // 1. Safe Guard: Redirect if no booking data
  if (!booking || !hasItem || !hasAnyDate) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="rounded-2xl border border-slate-200 shadow-sm p-8 bg-white text-center max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">No reservation found</h3>
            <p className="text-slate-600 mb-6">
              It looks like your session expired or no booking was selected.
            </p>
            <button
              className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium w-full"
              onClick={() => router.push("/")}
            >
              Browse Listings
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const from = booking.dates?.checkIn ? parseISO(booking.dates.checkIn) : null;
  const to = booking.dates?.checkOut ? parseISO(booking.dates.checkOut) : null;
  const singleDate = booking.schedule?.date
    ? parseISO(booking.schedule.date)
    : null;

  const itemTitle = booking.item?.title ?? "Your booking";
  const itemLocation = booking.item?.location ?? "";

  function generateReservationId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.floor(Math.random() * 1e6)
      .toString(36)
      .toUpperCase();
    return `AVR-${ts}-${rnd}`;
  }

  const payNow = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // Ensure we have a valid userId. If not in booking store, we might need to fetch it from session.
      // Based on schema, userId is required for Payment record.
      const userId = booking.userId || (typeof window !== 'undefined' ? localStorage.getItem('userId') : null);

      if (!userId) {
        throw new Error("User session not found. Please log in again.");
      }

      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingType: booking.type.toUpperCase(), // STAY | EVENT | EXPERIENCE
          bookingId: booking.dbId, // DB booking id
          amount: Math.round(booking.cost.total * 100), // convert to kobo and ensure integer
          email: email, // from local state
          userId: userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to initialize payment");
      }

      // 🔥 Redirect to Paystack
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("No authorization URL received from payment provider");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment initialization failed",
      );
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    setError("");

    // 2. Validation Logic
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all contact details to proceed.");
      return;
    }

    // 👉 PAYMENT STARTS HERE
    await payNow();
  };

  const handleDelete = async () => {
    // 4. Safe Delete Confirmation
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/bookingStay/${booking.dbId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete booking");
      }

      // Clear store or handle cleanup if necessary
      // setBooking(null); // Optional: clear store
      router.push("/");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Input Forms */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">
                Confirm and pay
              </h1>
            </div>

            {/* Contact Info Card */}
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-800">
                  Contact information
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
                {booking.note && (
                  <div className="sm:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                    <span className="font-semibold">Note to host:</span>{" "}
                    {booking.note}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Card */}
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-800">
                  Payment method
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 flex items-start gap-3">
                  <div className="p-2 bg-white rounded border border-slate-100 shadow-sm">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">
                      Payment Integration
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You will not be charged yet. This is a demo step for
                      Paystack/Flutterwave.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || isDeleting}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm and Pay"
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Booking Summary */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white sticky top-24 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-semibold text-slate-800">
                  Your trip
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Item Details */}
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 leading-tight mb-2">
                    {itemTitle}
                  </h3>
                  {itemLocation && (
                    <div className="text-sm text-slate-500 flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      {itemLocation}
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100" />

                {/* Dates & Guests */}
                <div className="space-y-3 text-sm text-slate-700">
                  {from && to ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Dates</span>
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarDays className="h-4 w-4 text-emerald-600" />
                        <span>
                          {format(from, "MMM d")} - {format(to, "MMM d")}
                        </span>
                      </div>
                    </div>
                  ) : singleDate ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Date</span>
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarDays className="h-4 w-4 text-emerald-600" />
                        {format(singleDate, "PP")}
                      </div>
                    </div>
                  ) : null}

                  {typeof booking.guests === "number" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Guests</span>
                      <div className="flex items-center gap-2 font-medium">
                        <Users className="h-4 w-4 text-emerald-600" />
                        {booking.guests}{" "}
                        {booking.guests > 1 ? "guests" : "guest"}
                      </div>
                    </div>
                  )}

                  {typeof booking.tickets === "number" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tickets</span>
                      <div className="flex items-center gap-2 font-medium">
                        <Ticket className="h-4 w-4 text-emerald-600" />
                        {booking.tickets}{" "}
                        {booking.tickets > 1 ? "tickets" : "ticket"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100" />

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>
                      ₦{booking.cost?.subtotal?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  {typeof booking.cost?.cleaning === "number" && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Cleaning fee</span>
                      <span>₦{booking.cost?.cleaning?.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Service fee</span>
                    <span>₦{booking.cost?.service?.toLocaleString() ?? 0}</span>
                  </div>

                  <div className="h-px bg-slate-200 my-2" />

                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-emerald-700">
                      ₦{booking.cost?.total?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>

                {/* Cancel Action */}
                <div className="pt-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting || isProcessing}
                    className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {isDeleting ? "Cancelling..." : "Cancel this booking"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
