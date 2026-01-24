import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    return NextResponse.json([], { status: 200 });
  }

  const stays = await prisma.stay.findMany({
    where: {
      isPublished: true,
      address: {
        OR: [
          {
            city: {
              contains: destination,
              mode: "insensitive",
            },
          },
          {
            country: {
              contains: destination,
              mode: "insensitive",
            },
          },
          {
            line1: {
              contains: destination,
              mode: "insensitive",
            },
          },
        ],
      },
    },
    include: {
      address: true,
      pricing: true,
    },
  });

  return NextResponse.json(stays);
}
