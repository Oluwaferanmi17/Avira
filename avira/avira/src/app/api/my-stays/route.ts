import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
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
    const stays = await prisma.stay.findMany({
      where: { hostId: user.id },
      include: {
        capacity: true,
        address: true,
        pricing: true,
        availability: true,
        bookings: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stays, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching host stays:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
