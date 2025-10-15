import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the logged-in host
    const host = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    // Fetch all bookings related to that host's properties
    const bookings = await prisma.stayBooking.findMany({
      where: {
        stay: {
          hostId: host.id, // ✅ Correct field
        },
      },
      include: {
        stay: true, // show stay details
        user: true, // show guest info
      },
    });

    return NextResponse.json(
      bookings.map((b) => ({
        ...b,
        status: "Confirmed",
      }))
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
