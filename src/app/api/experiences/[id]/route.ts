import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ Next.js 15: params is async
    const { id } = await context.params;

    const experienceId = Number(id);

    if (isNaN(experienceId)) {
      return NextResponse.json(
        { error: "Invalid experience ID" },
        { status: 400 },
      );
    }

    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("GET_EXPERIENCE_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
