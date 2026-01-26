// actions/getHostStays.ts
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export default async function getHostStays() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const stays = await prisma.stay.findMany({
    where: {
      hostId: session.user.id, // 👈 only this user’s stays
    },
    include: {
      address: true,
      pricing: true,
      capacity: true,
      bookings: true,
    },
  });

  return stays;
}
