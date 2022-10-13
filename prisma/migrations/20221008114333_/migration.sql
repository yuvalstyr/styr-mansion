-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionAction" AS ENUM ('RENT', 'MONTHLY_BILL', 'FIX', 'CONSTRUCTION', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionOwner" AS ENUM ('Ran', 'Moran', 'Yuval', 'Tenant');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "action" "TransactionAction" NOT NULL,
    "owner" "TransactionOwner" NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
