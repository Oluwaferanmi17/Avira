import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "../../../../actions/getCurrentUser";
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  // Upload to Cloudinary / S3 here
  const imageUrl = "https://uploaded-image-url";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      profileImage: imageUrl,
    },
  });

  return NextResponse.json({ avatar: imageUrl });
}
