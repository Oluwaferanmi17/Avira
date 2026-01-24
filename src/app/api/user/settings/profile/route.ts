import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "../../../../actions/getCurrentUser";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      bio: body.bio,
    },
  });

  return NextResponse.json({ success: true });
}
