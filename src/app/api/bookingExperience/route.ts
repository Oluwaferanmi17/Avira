import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const experienceId = Number(body.experienceId);
    const guests = Number(body.guests);
    const date = body.date;

    if (!experienceId || isNaN(experienceId) || guests <= 0 || !date) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    const subtotal = experience.price * guests;
    const service = subtotal * 0.05;
    const total = subtotal + service;

    const booking = await prisma.experienceBooking.create({
      data: {
        userId: Number(session.user.id),
        experienceId,
        date: new Date(date),
        guests,
        subtotal,
        service,
        total,
      },
      include: { experience: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("BOOKING EXPERIENCE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
