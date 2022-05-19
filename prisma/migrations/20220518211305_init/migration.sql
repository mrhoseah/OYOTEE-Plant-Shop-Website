/*
  Warnings:

  - You are about to drop the column `stateDate` on the `Coupon` table. All the data in the column will be lost.
  - You are about to alter the column `discount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `String` to `Decimal`.
  - You are about to alter the column `newPrice` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `originalPrice` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - Added the required column `productId` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "code" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "discount" DECIMAL NOT NULL,
    "discountStatus" BOOLEAN NOT NULL DEFAULT false,
    "originalPrice" DECIMAL NOT NULL,
    "newPrice" DECIMAL NOT NULL,
    "startDate" DATETIME,
    "expiryDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Coupon_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "newPrice", "originalPrice", "updatedAt") SELECT "code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "newPrice", "originalPrice", "updatedAt" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_productId_key" ON "Coupon"("productId");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "otherDetails" TEXT,
    "image" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" REAL NOT NULL DEFAULT 0.00,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER NOT NULL,
    "couponId" INTEGER,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("authorId", "categoryId", "couponId", "createdAt", "description", "id", "image", "name", "otherDetails", "price", "published", "quantity", "updatedAt") SELECT "authorId", "categoryId", "couponId", "createdAt", "description", "id", "image", "name", "otherDetails", "price", "published", "quantity", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "reviewedById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("id", "productId", "reviewedById") SELECT "id", "productId", "reviewedById" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
