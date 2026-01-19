/*
  Warnings:

  - A unique constraint covering the columns `[pagarmePlanId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pagarmePlanId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "pagarmePlanId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Plan_pagarmePlanId_key" ON "Plan"("pagarmePlanId");
