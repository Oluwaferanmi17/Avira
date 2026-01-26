/*
  Warnings:

  - A unique constraint covering the columns `[userId,stayId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,eventId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,experienceId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_eventId_key";

-- DropIndex
DROP INDEX "Review_experienceId_key";

-- DropIndex
DROP INDEX "Review_stayId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_stayId_key" ON "Review"("userId", "stayId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_eventId_key" ON "Review"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_experienceId_key" ON "Review"("userId", "experienceId");
