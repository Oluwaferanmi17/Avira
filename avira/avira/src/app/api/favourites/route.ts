/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { stayId } = body;
  if (!stayId) {
    return NextResponse.json({ error: "stayId required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  try {
    const favourite = await prisma.favourite.create({
      data: {
        userId: user.id,
        stayId,
      },
    });
    return NextResponse.json(favourite);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { message: "Already favourited" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { stayId } = body;
  if (!stayId) {
    return NextResponse.json({ error: "stayId required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  await prisma.favourite.deleteMany({
    where: { userId: user.id, stayId },
  });
  return NextResponse.json({ success: true });
}
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favoriteId: {
        include: { stay: { include: { address: true, pricing: true } } },
      },
    },
  });
  return NextResponse.json(user?.favoriteId ?? []);
}
