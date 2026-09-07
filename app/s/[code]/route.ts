import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AFFILIATE_ID = process.env.SHOPEE_AFFILIATE_ID || "";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  // Increment click count (fire and forget)
  prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 } },
  }).catch(() => {});

  // Build affiliate URL
  const target = new URL(`https://shopee.vn/product/${link.shopId}/${link.itemId}`);
  target.searchParams.set("utm_source", `an_${AFFILIATE_ID}`);
  target.searchParams.set("utm_medium", "affiliates");
  target.searchParams.set("utm_campaign", `cashback${link.subId ? "_" + link.subId : ""}`);
  target.searchParams.set("utm_content", "----");
  target.searchParams.set("af_siteid", AFFILIATE_ID);
  target.searchParams.set("pid", `an_${AFFILIATE_ID}`);

  return NextResponse.redirect(target.toString(), { status: 302 });
}
