import { PaymentMethodType, PaymentStatus } from "@/types";

export interface PaymentInitiationResult {
  success: boolean;
  status: PaymentStatus;
  providerTxId?: string;
  redirectUrl?: string;
  error?: string;
  rawResponse?: any;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: PaymentStatus;
  providerTxId?: string;
  error?: string;
  rawResponse?: any;
}

export interface PaymentGatewayAdapter {
  readonly type: PaymentMethodType;
  readonly nameAr: string;
  readonly nameEn: string;
  initiatePayment(order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    customerEmail: string;
    customerName: string;
  }, metadata?: any): Promise<PaymentInitiationResult>;
  verifyPayment(payload: any): Promise<PaymentVerificationResult>;
  refundPayment(providerTxId: string, amount: number): Promise<{ success: boolean; error?: string }>;
}
