export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "CUSTOMER";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethodType =
  | "CASH_ON_DELIVERY"
  | "STRIPE"
  | "PAYPAL"
  | "LOCAL_GATEWAY";

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
}

export interface CartItemType {
  id: string; // unique key in cart (often productId + variantId)
  productId: string;
  variantId?: string | null;
  nameAr: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
  maxStock: number;
  variantAttributes?: Record<string, string>;
}

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  city: string;
  region: string;
  street: string;
  building?: string;
  postalCode?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  discountAmount?: number;
  message?: string;
}

export interface OrderCreationInput {
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
  shippingAddress: ShippingAddressInput;
  paymentMethod: PaymentMethodType;
  shippingMethodId: string;
  couponCode?: string;
  notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
