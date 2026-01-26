/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const {
      title,
      description,
      category,
      photos,
      country,
      city,
      venue,
      dateStart,
      dateEnd,
      ticketPrice,
      capacity,
    } = body;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        photos,
        country,
        city,
        venue,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        ticketPrice,
        capacity,
        userId: user.id,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET_EVENTS_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
