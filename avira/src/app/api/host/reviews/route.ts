// /api/host/reviews/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { authOptions } from "../../auth/[...nextauth]/route";
// import Stay from "@/app/Page/stay/page";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!host) {
    return NextResponse.json({ error: "Host not found" }, { status: 404 });
  }
  const reviews = await prisma.review.findMany({
    where: {
      OR: [
        { stay: { hostId: host.id } },
        { event: { userId: host.id } },
        { experience: { hostId: host.id } },
      ],
    },
    include: {
      user: true,
      reply: true,
      stay: true,
      event: true,
      experience: true,
    },
    orderBy: { createdAt: "desc" },
  });
  console.log(reviews);

  return NextResponse.json(reviews);
}
