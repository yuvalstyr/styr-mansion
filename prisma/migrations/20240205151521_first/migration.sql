-- AlterEnum
ALTER TYPE "TransactionAction" ADD VALUE 'ELECTRICITY';

-- CreateTable
CREATE TABLE "Electricity" (
    "id" TEXT NOT NULL,
    "totalBill" DOUBLE PRECISION NOT NULL,
    "frontMeasurement" DOUBLE PRECISION NOT NULL,
    "frontConsumption" DOUBLE PRECISION NOT NULL,
    "frontCost" DOUBLE PRECISION NOT NULL,
    "basementMeasurement" DOUBLE PRECISION NOT NULL,
    "basementConsumption" DOUBLE PRECISION NOT NULL,
    "basementCost" DOUBLE PRECISION NOT NULL,
    "houseCost" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Electricity_pkey" PRIMARY KEY ("id")
);
