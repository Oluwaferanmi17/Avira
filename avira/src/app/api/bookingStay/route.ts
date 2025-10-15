/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
// Create a booking
export async function POST(req: Request) {
  try {
    const { userId, stayId, checkIn, checkOut, guests, note } =
      await req.json();

    // find stay and pricing
    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      include: { pricing: true },
    });

    if (!stay || !stay.pricing) {
      return NextResponse.json(
        { error: "Stay not found or not bookable" },
        { status: 404 }
      );
    }

    // calculate number of nights
    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    // calculate total price
    const total =
      nights * stay.pricing.basePrice +
      stay.pricing.cleaningFee +
      stay.pricing.serviceFee;

    // create booking
    const booking = await prisma.stayBooking.create({
      data: {
        userId,
        stayId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights,
        guests,
        note,
        total,
      },
    });
    await pusherServer.trigger(`user-${userId}`, "new-notification", {
      title: "Booking Confirmed 🎉",
      message: "Your booking for Lekki Apartment has been confirmed.",
      date: new Date().toLocaleString(),
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 }
    );
  }
}

// Get all bookings (optional)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const bookings = await prisma.stayBooking.findMany({
      where: userId ? { userId } : {},
      include: {
        stay: { include: { pricing: true, address: true } },
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing stayBooking id" },
        { status: 400 }
      );
    }

    await prisma.stayBooking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting StayBooking:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
