// /* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all user bookings
    const [stayBookings, eventBookings, experienceBookings] = await Promise.all(
      [
        prisma.stayBooking.findMany({
          where: { userId: user.id },
          include: {
            stay: {
              include: {
                address: true,
                pricing: true,
                host: { select: { id: true, name: true, image: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.eventBooking.findMany({
          where: { userId: user.id },
          include: {
            event: {
              include: { user: { select: { id: true, name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.experienceBooking.findMany({
          where: { userId: user.id },
          include: {
            experience: {
              include: {
                host: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ],
    );

    // Normalize Stay Bookings
    const stays = stayBookings.map((b) => ({
      id: b.id,
      type: "stay",
      title: b.stay?.title || "Stay",
      location: b.stay?.address
        ? `${b.stay.address.city}, ${b.stay.address.country}`
        : "Unknown location",
      dateStart: b.checkIn,
      dateEnd: b.checkOut,
      price: b.stay?.pricing?.basePrice ? `₦${b.stay.pricing.basePrice}` : "—",
      image: b.stay?.photos?.[0] || null,
      hostId: b.stay?.host?.id,
      hostName: b.stay?.host?.name,
      hostImage: b.stay?.host?.image,
      createdAt: b.createdAt,
    }));

    // Normalize Event Bookings
    const events = eventBookings
      .filter((b) => b.event && b.event.user) // 🔥 CRITICAL
      .map((b) => ({
        id: b.event.id, // use event id
        bookingId: b.id,
        type: "event",
        title: b.event.title,
        location: `${b.event.venue}, ${b.event.city}, ${b.event.country}`,
        dateStart: b.event.dateStart,
        dateEnd: b.event.dateEnd,
        price: b.event.ticketPrice ? `₦${b.event.ticketPrice}` : "Free",
        image: b.event.photos?.[0] || null,
        hostId: b.event.user.id, // ✅ guaranteed
        hostName: b.event.user.name,
        // hostImage: b.event.user.image,
        createdAt: b.createdAt,
      }));

    // Normalize Experience Bookings
    const experiences = experienceBookings.map((b) => ({
      id: b.id,
      type: "experience",
      title: b.experience?.title || "Experience",
      location: `${b.experience?.venue || ""}, ${b.experience?.city || ""}, ${
        b.experience?.country || ""
      }`,
      dateStart: b.date,
      dateEnd: b.date,
      price: b.experience?.price ? `₦${b.experience.price}` : "Free",
      image: b.experience?.photos?.[0] || null,
      hostId: b.experience?.host?.id,
      hostName: b.experience?.host?.name,
      hostImage: b.experience?.host?.image,
      createdAt: b.createdAt,
    }));

    // Combine and sort all trips
    const trips = [...stays, ...events, ...experiences].sort((a, b) => {
      const aDate = new Date(a.dateStart || a.createdAt).getTime();
      const bDate = new Date(b.dateStart || b.createdAt).getTime();
      return bDate - aDate;
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("TRIPS_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
