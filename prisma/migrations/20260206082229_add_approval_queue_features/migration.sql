-- AlterEnum
ALTER TYPE "StockAdjustmentStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "StockLog" ADD COLUMN     "rejectedBy" TEXT,
ADD COLUMN     "rejectionReason" TEXT;
