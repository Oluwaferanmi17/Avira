import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(_: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  await prisma.favourite.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Removed from wishlist" });
}
