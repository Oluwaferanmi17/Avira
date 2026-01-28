import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  try {
    const stays = await prisma.stay.findMany({
      where: {
        isPublished: true,
      },
      take: 8,
      include: {
        reviews: {
          select: { rating: true },
        },
        address: {
          select: {
            city: true,
            state: true,
          },
        },
        pricing: {
          select: {
            basePrice: true,
          },
        },
      },
    });

    const formatted = stays.map((stay) => {
      const ratings = stay.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        id: stay.id,
        title: stay.title,
        description: stay.description,
        image: stay.photos[0] ?? "/placeholder.jpg",
        location: stay.address
          ? `${stay.address.city}, ${stay.address.state}`
          : "Nigeria",
        pricePerNight: stay.pricing?.basePrice ?? 0,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 },
    );
  }
}
