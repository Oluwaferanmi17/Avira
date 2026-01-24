/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing stayBooking id" },
        { status: 400 }
      );
    }

    // 🔴 THE FIX IS HERE:
    // Convert string "123" to number 123
    await prisma.stayBooking.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting StayBooking:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
