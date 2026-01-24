/*
  Warnings:

  - A unique constraint covering the columns `[userId,stayId]` on the table `StayBooking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StayBooking_stayId_key";

-- DropIndex
DROP INDEX "StayBooking_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StayBooking_userId_stayId_key" ON "StayBooking"("userId", "stayId");
