/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // 🧠 Ensure exactly one target
    // const targets = [stayId, eventId, experienceId].filter(Boolean);
    // if (targets.length !== 4) {
    //   return NextResponse.json(
    //     { error: "Review must belong to exactly one item" },
    //     { status: 400 },
    //   );
    // }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔍 Build duplicate check dynamically
    const where: any = {
      userId: user.id,
    };

    if (stayId) where.stayId = stayId;
    if (eventId) where.eventId = eventId;
    if (experienceId) where.experienceId = experienceId;

    const existingReview = await prisma.review.findFirst({ where });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this item" },
        { status: 400 },
      );
    }

    // ✅ Safe create
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        stayId: stayId ? Number(stayId) : undefined,
        eventId: eventId ? Number(eventId) : undefined,
        experienceId: experienceId ? Number(experienceId) : undefined,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Error creating review:", error);

    // Extra safety net
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate review not allowed" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
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
    if (stayId) filters.push({ stayId: Number(stayId) });
    if (eventId) filters.push({ eventId: Number(eventId) });
    if (experienceId) filters.push({ experienceId: Number(experienceId) });

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
      { status: 500 },
    );
  }
}
