import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "@/lib/db-health";
import { localStore } from "./local-store";
import { CouponValidationResult } from "@/types";

export class CouponService {
  static async validateCoupon(
    code: string,
    subtotal: number,
    userId?: string
  ): Promise<CouponValidationResult> {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.validateCoupon(code, subtotal) as CouponValidationResult;
    }

    try {
      const cleanCode = code.trim().toUpperCase();

      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (!coupon || !coupon.isActive) {
        return { valid: false, message: "كود الخصم غير موجود أو تم إيقافه" };
      }

      const now = new Date();
      if (coupon.startDate > now) {
        return { valid: false, message: "كود الخصم لم يبدأ تفعيله بعد" };
      }

      if (coupon.endDate < now) {
        return { valid: false, message: "انتهت صلاحية كود الخصم" };
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: "تم استنفاد الحد الأقصى لاستخدام هذا الكوبون" };
      }

      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        return {
          valid: false,
          message: `الحد الأدنى للطلب لتفعيل هذا الكوبون هو ${coupon.minOrderAmount} ر.س`,
        };
      }

      if (userId && coupon.perUserLimit) {
        const userUsage = await prisma.order.count({
          where: {
            userId,
            couponId: coupon.id,
            status: { not: "CANCELLED" },
          },
        });

        if (userUsage >= coupon.perUserLimit) {
          return { valid: false, message: "لقد تجاوزت الحد المسموح لك باستخدام هذا الكوبون" };
        }
      }

      // Calculate discount amount
      let discountAmount = 0;
      const discountVal = Number(coupon.discountValue);

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (subtotal * discountVal) / 100;
        if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
          discountAmount = Number(coupon.maxDiscount);
        }
      } else {
        discountAmount = Math.min(discountVal, subtotal);
      }

      return {
        valid: true,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: discountVal,
        discountAmount: Math.round(discountAmount * 100) / 100,
        message: "تم تطبيق كود الخصم بنجاح!",
      };
    } catch {
      return localStore.validateCoupon(code, subtotal) as CouponValidationResult;
    }
  }

  static async incrementUsage(couponId: string) {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) return;

    try {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    } catch (e) {
      console.error("Failed to increment coupon usage:", e);
    }
  }
}
