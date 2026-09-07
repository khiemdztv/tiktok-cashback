import { prisma } from "./prisma";

export interface OrderInput {
  trackingId?: string;
  phone: string;
  walletType: string;
  bankAccount?: string;
  originalUrl: string;
  productName?: string;
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrdersByPhone(phone: string) {
  return prisma.order.findMany({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
}

export async function addOrder(data: OrderInput) {
  return prisma.order.create({
    data: {
      trackingId: data.trackingId,
      phone: data.phone,
      walletType: data.walletType,
      bankAccount: data.bankAccount,
      originalUrl: data.originalUrl,
      productName: data.productName || "Sản phẩm Shopee",
      status: "pending",
    },
  });
}

export async function updateOrderAffLink(id: string, affUrl: string, cashbackAmount?: number) {
  return prisma.order.update({
    where: { id },
    data: {
      affUrl,
      affShortUrl: affUrl,
      ...(cashbackAmount !== undefined ? { cashbackAmount } : {}),
    },
  });
}

export async function markOrderPaid(id: string) {
  try {
    await prisma.order.update({
      where: { id },
      data: {
        status: "paid",
        paidAt: new Date(),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function markOrderRejected(id: string) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status: "rejected" },
    });
    return true;
  } catch {
    return false;
  }
}
