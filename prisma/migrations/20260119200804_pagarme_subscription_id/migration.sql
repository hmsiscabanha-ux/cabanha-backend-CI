/*
  Warnings:

  - A unique constraint covering the columns `[pagarmeSubId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "pagarmeSubId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_pagarmeSubId_key" ON "Subscription"("pagarmeSubId");
