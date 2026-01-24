import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";
// 📨 Send a new message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, text } = await req.json();
    if (!conversationId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!sender) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        text,
        senderId: sender.id,
        conversationId,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // ✅ Real-time chat update
    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "new-message",
      message,
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationIdParam = searchParams.get("conversationId");

    if (!conversationIdParam) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 },
      );
    }

    const conversationId = Number(conversationIdParam);

    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversationId" },
        { status: 400 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
