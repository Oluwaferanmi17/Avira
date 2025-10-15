"use server";
import prisma from "../../lib/prismadb";
import { getServerSession } from "next-auth";
export async function getReservations() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }
    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      include: {
        stay: { include: { address: true } },
        event: true,
        experience: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (err) {
    console.error("getReservations error:", err);
    return [];
  }
}
