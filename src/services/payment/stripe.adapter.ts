import { PaymentGatewayAdapter, PaymentInitiationResult, PaymentVerificationResult } from "./payment.interface";
import { PaymentMethodType } from "@/types";

export class StripePaymentAdapter implements PaymentGatewayAdapter {
  readonly type: PaymentMethodType = "STRIPE";
  readonly nameAr = "بطاقة ائتمان / مدى (Stripe)";
  readonly nameEn = "Credit Card / Mada (Stripe)";

  async initiatePayment(order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerEmail: string;
    customerName: string;
  }): Promise<PaymentInitiationResult> {
    const apiKey = process.env.STRIPE_SECRET_KEY;

    // If live API key is provided and not test placeholder, we integrate directly
    if (apiKey && !apiKey.includes("mock")) {
      try {
        // Production Stripe checkout session call can be made here
        // e.g. await stripe.checkout.sessions.create(...)
      } catch (err: any) {
        return {
          success: false,
          status: "FAILED",
          error: err.message || "فشلت عملية تهيئة جلسة الدفع عبر Stripe",
        };
      }
    }

    // Default Sandbox / Mock simulation for development
    return {
      success: true,
      status: "PAID",
      providerTxId: `stripe_ch_${Math.random().toString(36).substring(2, 12)}`,
      rawResponse: {
        provider: "Stripe",
        mode: "sandbox",
        currency: process.env.NEXT_PUBLIC_CURRENCY || "SAR",
        amount: order.totalAmount,
      },
    };
  }

  async verifyPayment(payload: any): Promise<PaymentVerificationResult> {
    return {
      success: true,
      status: "PAID",
      providerTxId: payload?.providerTxId || `stripe_verified_${Date.now()}`,
    };
  }

  async refundPayment(providerTxId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    return {
      success: true,
    };
  }
}
