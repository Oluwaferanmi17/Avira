/*
  Warnings:

  - Made the column `userId` on table `Trip` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Trip_userId_key";

-- DropIndex
DROP INDEX "TripItem_eventId_key";

-- DropIndex
DROP INDEX "TripItem_experienceId_key";

-- DropIndex
DROP INDEX "TripItem_stayId_key";

-- DropIndex
DROP INDEX "TripItem_tripId_key";

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "userId" SET NOT NULL;
