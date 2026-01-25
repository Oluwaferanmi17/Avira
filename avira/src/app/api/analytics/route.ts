import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count bookings where the listing belongs to this user
    const staysCount = await prisma.stayBooking.count({
      where: { stay: { hostId: user.id } },
    });

    const eventsCount = await prisma.eventBooking.count({
      where: { event: { userId: user.id } },
    });

    const experiencesCount = await prisma.experienceBooking.count({
      where: { experience: { hostId: user.id } },
    });

    return NextResponse.json([
      { name: "Stays", count: staysCount },
      { name: "Events", count: eventsCount },
      { name: "Experiences", count: experiencesCount },
    ]);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
