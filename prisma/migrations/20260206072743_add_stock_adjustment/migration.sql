-- CreateEnum
CREATE TYPE "StockAdjustmentType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "StockAdjustmentStatus" AS ENUM ('APPROVED', 'PENDING');

-- CreateTable
CREATE TABLE "StockLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "StockAdjustmentType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "status" "StockAdjustmentStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockLog_productId_idx" ON "StockLog"("productId");

-- CreateIndex
CREATE INDEX "StockLog_status_idx" ON "StockLog"("status");

-- CreateIndex
CREATE INDEX "StockLog_createdAt_idx" ON "StockLog"("createdAt");

-- AddForeignKey
ALTER TABLE "StockLog" ADD CONSTRAINT "StockLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
