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
    await prisma.stayBooking.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting StayBooking:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
