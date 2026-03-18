import { PrismaClient } from "@prisma/client";

// Mẹo nhỏ để Prisma không bị khởi tạo nhiều connection trong Next.js dev mode
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
