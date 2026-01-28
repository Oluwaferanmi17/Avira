import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const stays = await prisma.stay.findMany({
      where: {
        isPublished: true,
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        address: true,
        pricing: true,
      },
    });

    // Map DB shape → UI shape
    const formatted = stays.map((stay) => ({
      id: stay.id,
      title: stay.title,
      description: stay.description,
      image: stay.photos[0] ?? "/placeholder.jpg",
      location: stay.address
        ? `${stay.address.city}, ${stay.address.country}`
        : "Nigeria",
      pricePerNight: stay.pricing?.basePrice ?? 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stays" },
      { status: 500 },
    );
  }
}
