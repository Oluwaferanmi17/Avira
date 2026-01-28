import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE() {
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

    await prisma.notification.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (err) {
    console.error("Error clearing notifications:", err);
    return NextResponse.json(
      { error: "Failed to clear notifications" },
      { status: 500 },
    );
  }
}
