import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ✅ Helper to safely get user
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  return user;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const favourites = await prisma.favourite.findMany({
    where: { userId: user.id },
    include: {
      stay: {
        select: {
          title: true,
          photos: true,
          address: {
            select: { city: true, country: true },
          },
          pricing: {
            select: { basePrice: true },
          },
        },
      },
      event: {
        select: {
          title: true,
          photos: true,
          city: true,
          ticketPrice: true,
        },
      },
      experience: {
        select: {
          title: true,
          photos: true,
          price: true,
          city: true,
        },
      },
    },
  });

  return NextResponse.json(favourites);
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { itemId, type } = await req.json();
    if (!itemId || !type)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await prisma.favourite.findFirst({
      where: { userId: user.id, [`${type}Id`]: itemId },
    });

    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
      return NextResponse.json({ removed: true });
    }

    await prisma.favourite.create({
      data: { userId: user.id, [`${type}Id`]: itemId },
    });

    return NextResponse.json({ added: true });
  } catch (err) {
    console.error("Error in POST /api/wishlist:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
