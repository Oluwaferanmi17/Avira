import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!trip || trip.userId !== user.id) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      type,
      status = "planned",
      customTitle,
      customDescription,
      customDate,
      customLocation,
      stayId,
      eventId,
      experienceId,
    } = body;

    if (!type || (type === "custom" && !customTitle)) {
      return NextResponse.json(
        { error: "Type and title (for custom) are required" },
        { status: 400 }
      );
    }

    // Validate that if linking to an item, it exists
    if (type === "stay" && stayId) {
      const stay = await prisma.stay.findUnique({ where: { id: stayId } });
      if (!stay) {
        return NextResponse.json({ error: "Stay not found" }, { status: 404 });
      }
    } else if (type === "event" && eventId) {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
    } else if (type === "experience" && experienceId) {
      const experience = await prisma.experience.findUnique({
        where: { id: experienceId },
      });
      if (!experience) {
        return NextResponse.json(
          { error: "Experience not found" },
          { status: 404 }
        );
      }
    }

    const item = await prisma.tripItem.create({
      data: {
        type,
        status,
        customTitle: type === "custom" ? customTitle : null,
        customDescription: type === "custom" ? customDescription : null,
        customDate:
          type === "custom" ? (customDate ? new Date(customDate) : null) : null,
        customLocation: type === "custom" ? customLocation : null,
        tripId: id,
        stayId: type === "stay" ? stayId : null,
        eventId: type === "event" ? eventId : null,
        experienceId: type === "experience" ? experienceId : null,
      },
      include: {
        stay: {
          include: {
            address: true,
            pricing: true,
          },
        },
        event: true,
        experience: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("ADD_TRIP_ITEM_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { id: itemId } = body;

    const item = await prisma.tripItem.findUnique({
      where: { id: itemId },
      include: { trip: { include: { user: true } } },
    });

    if (!item || item.trip.userId !== user.id || item.tripId !== id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.tripItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_TRIP_ITEM_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
