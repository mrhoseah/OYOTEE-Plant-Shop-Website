/*
  Warnings:

  - You are about to drop the column `productId` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT,
    "profileId" INTEGER,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Image_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CouponToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "code" TEXT NOT NULL,
    "discount" DECIMAL NOT NULL,
    "discountStatus" BOOLEAN NOT NULL DEFAULT false,
    "originalPrice" DECIMAL NOT NULL,
    "newPrice" DECIMAL NOT NULL,
    "startDate" DATETIME,
    "expiryDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Coupon" ("code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "newPrice", "originalPrice", "startDate", "updatedAt") SELECT "code", "createdAt", "discount", "discountStatus", "expiryDate", "id", "name", "newPrice", "originalPrice", "startDate", "updatedAt" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
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
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("authorId", "categoryId", "createdAt", "description", "id", "image", "name", "otherDetails", "price", "published", "quantity", "updatedAt") SELECT "authorId", "categoryId", "createdAt", "description", "id", "image", "name", "otherDetails", "price", "published", "quantity", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Image_productId_key" ON "Image"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_profileId_key" ON "Image"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "_CouponToProduct_AB_unique" ON "_CouponToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponToProduct_B_index" ON "_CouponToProduct"("B");
