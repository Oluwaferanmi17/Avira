// /api/host/reply/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reviewId, message } = await req.json();

  if (!reviewId || !message.trim()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const reply = await prisma.reply.create({
    data: {
      message,
      review: { connect: { id: Number(reviewId) } },
    },
  });

  return NextResponse.json(reply);
}
