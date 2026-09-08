CREATE TABLE "ShopeeVoucher" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "discountValue" INTEGER NOT NULL DEFAULT 0,
    "discountType" TEXT NOT NULL DEFAULT 'fixed',
    "minSpend" INTEGER NOT NULL DEFAULT 0,
    "maxDiscount" INTEGER NOT NULL DEFAULT 0,
    "campaign" TEXT,
    "category" TEXT,
    "claimUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'scraper',
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "shopeeVoucherId" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopeeVoucher_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShopeeVoucher_shopeeVoucherId_key" ON "ShopeeVoucher"("shopeeVoucherId");
CREATE INDEX "ShopeeVoucher_campaign_idx" ON "ShopeeVoucher"("campaign");
CREATE INDEX "ShopeeVoucher_isActive_endDate_idx" ON "ShopeeVoucher"("isActive", "endDate");
CREATE INDEX "ShopeeVoucher_discountType_idx" ON "ShopeeVoucher"("discountType");
