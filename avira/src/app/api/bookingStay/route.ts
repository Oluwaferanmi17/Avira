/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = parseInt(body.userId);
    const stayId = parseInt(body.stayId);
    const { checkIn, checkOut, guests, note } = body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // find stay and pricing
    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      include: { pricing: true },
    });

    if (!stay || !stay.pricing) {
      return NextResponse.json(
        { error: "Stay not found or not bookable" },
        { status: 404 },
      );
    }

    // calculate nights
    const nights =
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    // calculate total
    const total =
      nights * stay.pricing.basePrice +
      stay.pricing.cleaningFee +
      stay.pricing.serviceFee;

    // ✅ TRANSACTION (prevents race conditions)
    const booking = await prisma.$transaction(async (tx) => {
      // 🔒 1. Check for overlapping bookings
      const conflict = await tx.stayBooking.findFirst({
        where: {
          stayId,
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
      });

      if (conflict) {
        throw new Error("DOUBLE_BOOKING");
      }

      // ✅ 2. Create booking only if safe
      return await tx.stayBooking.create({
        data: {
          userId,
          stayId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          nights,
          guests: parseInt(guests),
          note,
          total,
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    if (error.message === "DOUBLE_BOOKING") {
      return NextResponse.json(
        { error: "This stay is already booked for the selected dates" },
        { status: 409 },
      );
    }

    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 },
    );
  }
}
