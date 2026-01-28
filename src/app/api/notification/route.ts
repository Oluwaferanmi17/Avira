import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
