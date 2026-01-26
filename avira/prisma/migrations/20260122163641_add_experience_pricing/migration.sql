/*
  Warnings:

  - Added the required column `service` to the `ExperienceBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `ExperienceBooking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExperienceBooking" ADD COLUMN     "service" INTEGER NOT NULL,
ADD COLUMN     "subtotal" INTEGER NOT NULL;
