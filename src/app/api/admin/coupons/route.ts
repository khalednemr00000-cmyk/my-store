import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseAvailable } from "@/lib/db-health";
import { localStore } from "@/services/local-store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === "CUSTOMER") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      endDate,
    } = body;

    if (!code || !discountValue || !endDate) {
      return NextResponse.json(
        { success: false, error: "كافة الحقول الأساسية مطلوبة" },
        { status: 400 }
      );
    }

    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      const coupon = localStore.createCoupon({
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        usageLimit,
        endDate,
      });
      return NextResponse.json({ success: true, coupon });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        description,
        discountType: discountType || "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        endDate: new Date(endDate),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "فشلت عملية إنشاء الكوبون" },
      { status: 500 }
    );
  }
}
