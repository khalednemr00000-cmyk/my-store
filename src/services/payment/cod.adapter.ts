import { PaymentGatewayAdapter, PaymentInitiationResult, PaymentVerificationResult } from "./payment.interface";
import { PaymentMethodType } from "@/types";

export class CashOnDeliveryAdapter implements PaymentGatewayAdapter {
  readonly type: PaymentMethodType = "CASH_ON_DELIVERY";
  readonly nameAr = "الدفع عند الاستلام (COD)";
  readonly nameEn = "Cash on Delivery";

  async initiatePayment(order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
  }): Promise<PaymentInitiationResult> {
    return {
      success: true,
      status: "PENDING", // Cash on Delivery is pending until goods are delivered
      providerTxId: `COD-${order.orderNumber}-${Date.now()}`,
      rawResponse: {
        method: "COD",
        note: "يتم تحصيل المبلغ نقداً أو عبر بطاقة الدفع عند وصول المندوب",
      },
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    return {
      success: true,
      status: payload?.isDelivered ? "PAID" : "PENDING",
      providerTxId: payload?.providerTxId,
    };
  }

  async refundPayment(providerTxId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }
}
