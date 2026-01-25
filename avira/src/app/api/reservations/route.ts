import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, // "stay" | "event" | "experience"
      stayId,
      eventId,
      experienceId,
      startDate,
      endDate,
      tickets,
      participants,
      note,
      subtotal,
      cleaningFee,
      serviceFee,
      totalPrice,
    } = body;

    // ✅ Session check
    const session = await getServerSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "User session not found" },
        { status: 401 }
      );
    }

    // ✅ Required fields check
    if (!type || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Stay-specific validation
    if (type === "stay") {
      if (!stayId || !startDate || !endDate) {
        return NextResponse.json(
          { error: "Stay reservation requires stayId, startDate, and endDate" },
          { status: 400 }
        );
      }

      const overlapping = await prisma.reservation.findFirst({
        where: {
          stayId,
          AND: [
            { startDate: { lte: new Date(endDate) } },
            { endDate: { gte: new Date(startDate) } },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: "Selected dates are not available" },
          { status: 409 }
        );
      }
    }

    // ✅ Event-specific validation
    if (type === "event" && (!eventId || !tickets)) {
      return NextResponse.json(
        { error: "Event reservation requires eventId and tickets" },
        { status: 400 }
      );
    }

    // ✅ Experience-specific validation
    if (type === "experience" && (!experienceId || !participants)) {
      return NextResponse.json(
        {
          error:
            "Experience reservation requires experienceId and participants",
        },
        { status: 400 }
      );
    }

    // ✅ Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        type,
        userId: session.user.id,
        stayId,
        eventId,
        experienceId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        tickets,
        participants,
        note,
        subtotal,
        // Only include cleaningFee for stays
        cleaningFee: type === "stay" ? cleaningFee : null,
        serviceFee,
        totalPrice,
      },
      include: {
        stay: true,
        event: true,
        experience: true,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error("Reservation create error:", err);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
