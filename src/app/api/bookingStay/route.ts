/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Destructure and convert types safely
    // Even if they come as strings ("63"), this forces them to numbers (63)
    const userId = parseInt(body.userId);
    const stayId = parseInt(body.stayId);

    const { checkIn, checkOut, guests, note } = body;

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
        userId, // ✅ Now strictly a Number
        stayId, // ✅ Now strictly a Number
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights,
        guests: parseInt(guests), // Good practice to ensure this is an int too
        note,
        total,
      },
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    const query: any = {
      include: {
        stay: { include: { pricing: true, address: true } },
      },
    };

    // Fix for GET as well: Ensure userId matches the type in DB (Int)
    if (userIdParam) {
      query.where = { userId: parseInt(userIdParam) };
    }

    const bookings = await prisma.stayBooking.findMany(query);

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: error.message },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing stayBooking id" },
//         { status: 400 }
//       );
//     }

//     await prisma.stayBooking.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error("Error deleting StayBooking:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
