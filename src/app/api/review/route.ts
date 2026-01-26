import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rating, comment, stayId, eventId, experienceId } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        stayId,
        eventId,
        experienceId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stayId = searchParams.get("stayId");
    const eventId = searchParams.get("eventId");
    const experienceId = searchParams.get("experienceId");

    // Build filter dynamically
    const filters = [];
    if (stayId) filters.push({ stayId });
    if (eventId) filters.push({ eventId });
    if (experienceId) filters.push({ experienceId });

    const whereClause = filters.length > 0 ? { OR: filters } : {}; // if none provided, return all

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
