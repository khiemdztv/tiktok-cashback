import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add revalidation so this endpoint is cached for 60 seconds
// to prevent database overload from too many concurrent users
export const revalidate = 60;

export async function GET() {
  try {
    const totalLinks = await prisma.order.count();
    
    // Sum only the cashbackAmount from orders
    const agg = await prisma.order.aggregate({
      _sum: {
        cashbackAmount: true
      }
    });

    const totalCashback = agg._sum.cashbackAmount || 0;

    return NextResponse.json({
      success: true,
      totalLinks,
      totalCashback
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return NextResponse.json({ success: false, totalLinks: 0, totalCashback: 0 }, { status: 500 });
  }
}
