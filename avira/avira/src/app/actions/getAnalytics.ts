"use server";

import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAnalytics() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return null;

    const [staysCount, eventsCount, experiencesCount] = await Promise.all([
      prisma.stayBooking.count({ where: { stay: { hostId: user.id } } }),
      prisma.eventBooking.count({ where: { event: { userId: user.id } } }),
      prisma.experienceBooking.count({
        where: { experience: { hostId: user.id } },
      }),
    ]);

    // const [stayViews, eventViews, experienceViews] = await Promise.all([
    //   prisma.stay.aggregate({
    //     where: { hostId: user.id },
    //     _sum: { viewCount: true },
    //   }),
    //   prisma.event.aggregate({
    //     where: { userId: user.id },
    //     _sum: { viewCount: true },
    //   }),
    //   prisma.experience.aggregate({
    //     where: { userId: user.id },
    //     _sum: { viewCount: true },
    //   }),
    // ]);

    // const totalViews =
    //   (stayViews._sum.viewCount || 0) +
    //   (eventViews._sum.viewCount || 0) +
    //   (experienceViews._sum.viewCount || 0);

    const totalBookings = staysCount + eventsCount + experiencesCount;
    const totalEarnings = totalBookings * 5000; // Placeholder

    return {
      staysCount,
      eventsCount,
      experiencesCount,
      totalBookings,
      totalEarnings,
      //   totalViews,
      breakdown: [
        { name: "Stays", count: staysCount },
        { name: "Events", count: eventsCount },
        { name: "Experiences", count: experiencesCount },
      ],
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}
