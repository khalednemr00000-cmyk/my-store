import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === "CUSTOMER") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    let updatedOrder;
    if (status) {
      updatedOrder = await OrderService.updateOrderStatus(id, status, trackingNumber);
    }
    if (paymentStatus) {
      updatedOrder = await OrderService.updatePaymentStatus(id, paymentStatus);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
