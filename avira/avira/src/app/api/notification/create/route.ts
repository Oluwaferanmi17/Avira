import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, title, message, iconColor } = body;

    const notification = await prisma.notification.create({
      data: { userId, type, title, message, iconColor },
    });

    // 🔔 Notify user in real-time via Pusher (coming next)
    return NextResponse.json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
