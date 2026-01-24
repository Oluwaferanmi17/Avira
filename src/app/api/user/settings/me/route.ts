import { NextResponse } from "next/server";
import getCurrentUser from "../../../../actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      profileImage: true,
      bannerImage: true,
      phone: true,
      bio: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(dbUser);
}
