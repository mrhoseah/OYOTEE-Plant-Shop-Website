/*
  Warnings:

  - A unique constraint covering the columns `[reviewedById,productId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewedById_productId_key" ON "Review"("reviewedById", "productId");
