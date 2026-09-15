import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { getSessionUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, shippingMethodId, couponCode, notes } = body;

    // Validate shipping and checkout data
    const validatedData = checkoutSchema.safeParse({
      ...shippingAddress,
      paymentMethod,
      shippingMethodId,
      couponCode,
      notes,
    });

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: validatedData.error.errors[0]?.message || "بيانات الطلب غير صالحة",
        },
        { status: 400 }
      );
    }

    const user = await getSessionUser();

    const result = await OrderService.createOrder(
      {
        items,
        shippingAddress,
        paymentMethod,
        shippingMethodId,
        couponCode,
        notes,
      },
      user?.id
    );

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        totalAmount: result.order.totalAmount,
      },
      redirectUrl: result.redirectUrl,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشلت عملية إنشاء الطلب" },
      { status: 400 }
    );
  }
}
