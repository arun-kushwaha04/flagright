-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'NORMAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('WITHDRAWL', 'TRANSFER', 'SELFTRANSFER');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR', 'RUB', 'JPY', 'EUR', 'CNY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'NORMAL',
    "defaultBankId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBank" (
    "userId" INTEGER NOT NULL,
    "bankId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserBank_pkey" PRIMARY KEY ("userId","bankId")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "originId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "originAmount" DOUBLE PRECISION NOT NULL,
    "originAmountCurrency" "Currency" NOT NULL,
    "originBankId" INTEGER NOT NULL,
    "destinationAmount" DOUBLE PRECISION NOT NULL,
    "destinationAmountCurrency" "Currency" NOT NULL,
    "destinationBankId" INTEGER,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "state" "TransactionState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Transaction_originId_idx" ON "Transaction"("originId");

-- CreateIndex
CREATE INDEX "Transaction_destinationId_idx" ON "Transaction"("destinationId");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultBankId_fkey" FOREIGN KEY ("defaultBankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_originId_fkey" FOREIGN KEY ("originId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_originBankId_fkey" FOREIGN KEY ("originBankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_destinationBankId_fkey" FOREIGN KEY ("destinationBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
