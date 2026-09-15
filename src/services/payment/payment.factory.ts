import { PaymentGatewayAdapter } from "./payment.interface";
import { CashOnDeliveryAdapter } from "./cod.adapter";
import { StripePaymentAdapter } from "./stripe.adapter";
import { PayPalPaymentAdapter } from "./paypal.adapter";
import { PaymentMethodType } from "@/types";

export class PaymentFactory {
  private static adapters: Map<PaymentMethodType, PaymentGatewayAdapter> = new Map<
    PaymentMethodType,
    PaymentGatewayAdapter
  >([
    ["CASH_ON_DELIVERY", new CashOnDeliveryAdapter()],
    ["STRIPE", new StripePaymentAdapter()],
    ["PAYPAL", new PayPalPaymentAdapter()],
  ]);

  static getAdapter(type: PaymentMethodType): PaymentGatewayAdapter {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      // Fallback to Cash on delivery
      return this.adapters.get("CASH_ON_DELIVERY")!;
    }
    return adapter;
  }

  static getAvailableMethods(): Array<{ type: PaymentMethodType; nameAr: string; nameEn: string }> {
    return Array.from(this.adapters.values()).map((adapter) => ({
      type: adapter.type,
      nameAr: adapter.nameAr,
      nameEn: adapter.nameEn,
    }));
  }
}
