/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

/* =========================
   GET STAY BY ID
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ await params
    const stayId = Number(id);

    if (isNaN(stayId)) {
      return NextResponse.json({ error: "Invalid stay ID" }, { status: 400 });
    }

    const stay = await prisma.stay.findUnique({
      where: { id: stayId },
      include: {
        capacity: true,
        address: true,
        pricing: true,
        availability: true,
      },
    });

    if (!stay) {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    return NextResponse.json(stay);
  } catch (error: any) {
    console.error("Error fetching stay:", error);
    return NextResponse.json(
      { error: "Failed to fetch stay", details: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE STAY
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stayId = Number(id);

    if (isNaN(stayId)) {
      return NextResponse.json({ error: "Invalid stay ID" }, { status: 400 });
    }

    await prisma.stay.delete({
      where: { id: stayId },
    });

    return NextResponse.json({ message: "Stay deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting stay:", error);
    return NextResponse.json(
      { error: "Failed to delete stay", details: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE STAY
========================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stayId = Number(id);
    const data = await req.json();

    if (isNaN(stayId)) {
      return NextResponse.json({ error: "Invalid stay ID" }, { status: 400 });
    }

    const existingStay = await prisma.stay.findUnique({
      where: { id: stayId },
    });

    if (!existingStay) {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    const updatedStay = await prisma.stay.update({
      where: { id: stayId },
      data: {
        title: data.title,
        description: data.description,
        pricing: {
          update: {
            basePrice: Number(data.price) || 0,
          },
        },
      },
      include: {
        pricing: true,
      },
    });

    return NextResponse.json(updatedStay, { status: 200 });
  } catch (error) {
    console.error("Error updating stay:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
