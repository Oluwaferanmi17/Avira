import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { type, title, message, iconColor } = body;

    const notification = await prisma.notification.create({
      data: {
        userId: user.id, // ✅ ALWAYS Prisma User.id
        type,
        title,
        message,
        iconColor,
      },
    });

    return NextResponse.json(notification);
  } catch (err) {
    console.error("Error creating notification:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
