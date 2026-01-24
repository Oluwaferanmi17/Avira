/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Stay } from "@prisma/client";
export type StayWithMeta = Stay & {
  address?: {
    city: string;
    country: string;
    line1: string;
  } | null;
  pricing?: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
  } | null;
  availability?: {
    unavailable: Date[];
  } | null;
  capacity?: {
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
  } | null;
  // isFavourited?: boolean; // ✅ add our flag
};
interface StayFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
}
export default async function getStay(
  filters: StayFilters = {}
): Promise<StayWithMeta[]> {
  try {
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { location, checkIn, checkOut } = filters;
    const whereClause: any = {};

    // ✅ Location filter
    if (location) {
      whereClause.OR = [
        { title: { contains: location, mode: "insensitive" } },
        { description: { contains: location, mode: "insensitive" } },
        { locationValue: { contains: location, mode: "insensitive" } },
        { address: { city: { contains: location, mode: "insensitive" } } },
      ];
    }
    if (checkIn && checkOut) {
      whereClause.NOT = {
        availability: {
          unavailable: {
            hasSome: Array.from(
              {
                length: Math.ceil(
                  (checkOut.getTime() - checkIn.getTime()) / 86400000
                ),
              },
              (_, i) => {
                const day = new Date(checkIn);
                day.setDate(day.getDate() + i);
                return day;
              }
            ),
          },
        },
      };
    }
    const stays = await prisma.stay.findMany({
      include: {
        capacity: true,
        address: true,
        pricing: true,
        availability: true,
        favourites: userId
          ? { where: { userId: parseInt(userId) } } // only check current user's favourites
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stays;
  } catch (error: any) {
    throw new Error(error);
  }
}
