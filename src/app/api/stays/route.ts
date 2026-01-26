/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const {
      title,
      description,
      homeType,
      photos,
      address,
      pricing,
      availability,
      amenities,
      capacity,
      rules,
      additionalRules,
    } = body;
    const stay = await prisma.stay.create({
      data: {
        title,
        description,
        homeType,
        photos,
        rules,
        amenities,
        additionalRules,
        isPublished: true, // publish directly

        // relations
        host: {
          connect: { email: session.user.email },
        },
        address: {
          create: {
            country: address.country,
            city: address.city,
            line1: address.line1,
            lat: address.lat,
            lng: address.lng,
          },
        },
        pricing: {
          create: {
            basePrice: pricing.basePrice,
            cleaningFee: pricing.cleaningFee,
            serviceFee: pricing.serviceFee,
          },
        },
        availability: {
          create: {
            unavailable: availability.unavailable,
          },
        },
        capacity: {
          create: {
            guests: capacity.guests,
            bedrooms: capacity.bedrooms,
            beds: capacity.beds,
            baths: capacity.baths,
          },
        },
      },
      include: {
        address: true,
        pricing: true,
        availability: true,
        capacity: true,
      },
    });

    return NextResponse.json(stay, { status: 201 });
  } catch (error: any) {
    console.error(" Prisma error:", error);
    return NextResponse.json(
      { error: "Failed to create stay", details: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const stays = await prisma.stay.findMany({
      where: { hostId: user.id },
      include: {
        capacity: true,
        address: true,
        pricing: true,
        availability: true,
      },
    });
    return NextResponse.json(stays);
  } catch (error: any) {
    console.error("Error fetching stays:", error);
    return NextResponse.json(
      { error: "Failed to fetch stays", details: error.message },
      { status: 500 }
    );
  }
}
