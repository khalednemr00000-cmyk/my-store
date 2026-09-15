import { PaymentGatewayAdapter, PaymentInitiationResult, PaymentVerificationResult } from "./payment.interface";
import { PaymentMethodType } from "@/types";

export class PayPalPaymentAdapter implements PaymentGatewayAdapter {
  readonly type: PaymentMethodType = "PAYPAL";
  readonly nameAr = "باي بال (PayPal)";
  readonly nameEn = "PayPal";

  async initiatePayment(order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerEmail: string;
  }): Promise<PaymentInitiationResult> {
    return {
      success: true,
      status: "PAID",
      providerTxId: `PAYPAL-CAPTURE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      rawResponse: {
        provider: "PayPal",
        mode: process.env.PAYPAL_MODE || "sandbox",
        amount: order.totalAmount,
      },
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    return {
      success: true,
      status: "PAID",
      providerTxId: payload?.providerTxId,
    };
  }

  async refundPayment(providerTxId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }
}
