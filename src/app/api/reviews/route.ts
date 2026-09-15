import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { isDatabaseAvailable } from "@/lib/db-health";
import { localStore } from "@/services/local-store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول لإضافة تقييم" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { productId, rating, comment } = validated.data;
    const isOnline = await isDatabaseAvailable();

    if (!isOnline) {
      const review = localStore.addReview(productId, {
        rating,
        comment,
        userName: user.name,
      });
      return NextResponse.json({ success: true, review });
    }

    // Check if user has purchased this product before to grant "isVerified" badge
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.id,
          status: { in: ["DELIVERED", "CONFIRMED", "SHIPPED"] },
        },
      },
    });

    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId: user.id,
        },
      },
      update: {
        rating,
        comment,
        isVerified: Boolean(hasPurchased),
        isApproved: true,
      },
      create: {
        productId,
        userId: user.id,
        rating,
        comment,
        isVerified: Boolean(hasPurchased),
        isApproved: true,
      },
    });

    // Update product ratingAverage and reviewsCount
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: Math.round(avg * 10) / 10,
        reviewsCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { success: false, error: "فشل حفظ التقييم" },
      { status: 500 }
    );
  }
}
