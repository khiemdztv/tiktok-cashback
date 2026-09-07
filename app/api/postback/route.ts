import { NextResponse } from "next/server";

// Postback route - no longer used (Accesstrade removed)
// Kept as placeholder for future Shopee webhook integration

export async function GET() {
  return NextResponse.json({ success: true, msg: "Shopee Cashback - No postback configured" });
}
export async function POST() {
  return NextResponse.json({ success: true, msg: "Shopee Cashback - No postback configured" });
}
