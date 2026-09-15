import { NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { valid: false, message: "بيانات الكوبون غير مكتملة" },
        { status: 400 }
      );
    }

    const user = await getSessionUser();
    const result = await CouponService.validateCoupon(code, Number(subtotal), user?.id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, message: error.message || "حدث خطأ أثناء فحص الكوبون" },
      { status: 500 }
    );
  }
}
