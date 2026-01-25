// /src/app/api/analytics/overview/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Booking counts (for listings owned by this user)
    const [staysCount, eventsCount, experiencesCount] = await Promise.all([
      prisma.stayBooking.count({ where: { stay: { hostId: user.id } } }),
      prisma.eventBooking.count({ where: { event: { userId: user.id } } }),
      prisma.experienceBooking.count({
        where: { experience: { hostId: user.id } },
      }),
    ]);

    const totalBookings = staysCount + eventsCount + experiencesCount;

    // Views totals (assumes models have `viewCount` or `views` integer field)
    // Adjust `_sum` field name if your schema uses `views` instead of `viewCount`.
    // const [stayViewsAgg, eventViewsAgg, experienceViewsAgg] = await Promise.all(
    //   [
    //     prisma.stay.aggregate({
    //       where: { userId: user.id },
    //       _sum: { viewCount: true },
    //     }),
    //     prisma.event.aggregate({
    //       where: { userId: user.id },
    //       _sum: { viewCount: true },
    //     }),
    //     prisma.experience.aggregate({
    //       where: { userId: user.id },
    //       _sum: { viewCount: true },
    //     }),
    //   ]
    // );

    // const totalViews =
    //   (stayViewsAgg._sum.viewCount || 0) +
    //   (eventViewsAgg._sum.viewCount || 0) +
    //   (experienceViewsAgg._sum.viewCount || 0);

    return NextResponse.json({
      totalBookings,
      //   totalViews,
      detail: {
        staysCount,
        eventsCount,
        experiencesCount,
        // stayViews: stayViewsAgg._sum.viewCount || 0,
        // eventViews: eventViewsAgg._sum.viewCount || 0,
        // experienceViews: experienceViewsAgg._sum.viewCount || 0,
      },
    });
  } catch (error) {
    console.error("overview analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch overview analytics" },
      { status: 500 }
    );
  }
}
