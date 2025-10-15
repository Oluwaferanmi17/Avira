import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, eventId, tickets, note } = body;

    if (!userId || !eventId || !tickets) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Fetch event price to calculate totals
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const subtotal = event.ticketPrice * tickets;
    const service = 20; // flat fee, or % if you prefer
    const total = subtotal + service;
    const booking = await prisma.eventBooking.create({
      data: {
        userId,
        eventId,
        tickets,
        note,
        subtotal,
        service,
        total,
      },
      include: {
        event: true,
        user: true,
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
