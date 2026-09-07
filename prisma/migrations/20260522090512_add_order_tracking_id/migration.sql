-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT,
    "phone" TEXT NOT NULL,
    "walletType" TEXT NOT NULL,
    "bankAccount" TEXT,
    "originalUrl" TEXT NOT NULL,
    "affUrl" TEXT NOT NULL DEFAULT '',
    "affShortUrl" TEXT NOT NULL DEFAULT '',
    "productName" TEXT NOT NULL DEFAULT '',
    "productImage" TEXT NOT NULL DEFAULT '',
    "productPrice" INTEGER NOT NULL DEFAULT 0,
    "commissionAmount" INTEGER NOT NULL DEFAULT 0,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashbackAmount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "code" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "productName" TEXT NOT NULL DEFAULT '',
    "productImage" TEXT NOT NULL DEFAULT '',
    "productPrice" INTEGER NOT NULL DEFAULT 0,
    "subId" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingId_key" ON "Order"("trackingId");
