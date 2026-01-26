-- DropIndex
DROP INDEX "StayBooking_userId_stayId_key";

-- CreateIndex
CREATE INDEX "StayBooking_stayId_idx" ON "StayBooking"("stayId");

-- CreateIndex
CREATE INDEX "StayBooking_userId_idx" ON "StayBooking"("userId");
