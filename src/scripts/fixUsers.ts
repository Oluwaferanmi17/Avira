/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../lib/prismadb";
async function main() {
  // Find users with null updatedAt
  const brokenUsers = await prisma.user.findMany({
    where: { updatedAt: { equals: null as any } }, // 👈 cast, because Prisma doesn't accept null in types
  });

  console.log(`Found ${brokenUsers.length} users with null updatedAt`);

  // Fix them
  await prisma.user.updateMany({
    where: { updatedAt: { equals: null as any } },
    data: { updatedAt: new Date() }, // ✅ must be a Date, not null
  });

  console.log("✅ Fixed users with null updatedAt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
