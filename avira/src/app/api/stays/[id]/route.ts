/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const stay = await prisma.stay.findUnique({
      where: { id },
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
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await prisma.stay.delete({
      where: { id },
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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();

    // Make sure the stay exists
    const existingStay = await prisma.stay.findUnique({
      where: { id },
    });

    if (!existingStay) {
      return NextResponse.json({ error: "Stay not found" }, { status: 404 });
    }

    // Update the stay
    const updatedStay = await prisma.stay.update({
      where: { id },
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
