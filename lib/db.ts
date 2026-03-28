import { prisma } from "./prisma";

export interface OrderInput {
  phone: string;
  walletType: string;
  bankAccount?: string;
  originalUrl: string;
  affUrl: string;
  affShortUrl: string;
  productName: string;
  productImage: string;
  productPrice: number;
  commissionAmount: number;
  commissionRate: number;
  cashbackAmount: number;
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
      ...data,
      status: "created",
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
