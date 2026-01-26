"use server";

import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(
  id: string,
  type: "stay" | "event" | "experience"
) {
  // check if exists, then add/remove
  await prisma.favourite.upsert(/* your logic */);

  revalidatePath("/stay"); // refreshes page automatically
}
