/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
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
      duration,
      photos,
      country,
      city,
      venue,
      //   dateStart,
      //   dateEnd,
      highlights,
      price,
      //   capacity,
    } = body;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const experience = await prisma.experience.create({
      data: {
        title,
        description,
        category,
        duration,
        photos,
        country,
        city,
        venue,
        highlights,
        // dateStart: new Date(dateStart),
        // dateEnd: new Date(dateEnd),
        price,
        // venue,
        // capacity,
        hostId: user.id,
      },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (err: any) {
    console.error("Error creating experience:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("GET_EXPERIENCES_ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}
