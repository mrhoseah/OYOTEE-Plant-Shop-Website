/*
  Warnings:

  - You are about to drop the `_CouponToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CouponToProduct";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CouponOnProducts" (
    "productId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,

    PRIMARY KEY ("productId", "couponId"),
    CONSTRAINT "CouponOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CouponOnProducts_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
