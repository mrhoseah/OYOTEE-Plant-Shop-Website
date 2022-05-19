/*
  Warnings:

  - You are about to drop the column `newPrice` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `Coupon` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "code" TEXT NOT NULL,
    "discount" DECIMAL NOT NULL,
    "discountStatus" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATETIME,
    "expiryDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Coupon" ("code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "startDate", "updatedAt") SELECT "code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "startDate", "updatedAt" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
