import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import getCurrentUser from "../../../../actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  const isValid = await bcrypt.compare(
    currentPassword,
    dbUser!.hashedPassword!
  );

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
