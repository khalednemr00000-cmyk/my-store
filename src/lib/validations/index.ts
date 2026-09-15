import { z } from "zod";

// ==========================================
// Authentication Schemas
// ==========================================
export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
  phone: z
    .string()
    .min(9, "رقم الهاتف غير مكتمل")
    .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 خانات على الأقل"),
});

export const loginSchema = z.object({
  email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().min(1, "يرجى كتابة كلمة المرور"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "رمز الاستعادة غير صالح"),
  password: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل"),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

// ==========================================
// Address Schema
// ==========================================
export const addressSchema = z.object({
  recipientName: z.string().min(2, "اسم المستلم مطلوب"),
  phone: z.string().min(9, "رقم هاتف المستلم مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  region: z.string().min(2, "المنطقة مطلوبة"),
  street: z.string().min(3, "اسم الشارع مطلوب"),
  building: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// ==========================================
// Checkout & Order Schemas
// ==========================================
export const checkoutSchema = z.object({
  recipientName: z.string().min(2, "اسم المستلم مطلوب"),
  phone: z.string().min(9, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  region: z.string().min(2, "المنطقة أو الحي مطلوب"),
  street: z.string().min(3, "اسم الشارع مطلوب"),
  building: z.string().optional(),
  postalCode: z.string().optional(),
  shippingMethodId: z.string().min(1, "يرجى اختيار طريقة الشحن"),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "STRIPE", "PAYPAL", "LOCAL_GATEWAY"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

// ==========================================
// Product Schemas
// ==========================================
export const productSchema = z.object({
  nameAr: z.string().min(2, "اسم المنتج بالعربية مطلوب"),
  nameEn: z.string().optional(),
  slug: z.string().min(2, "الرابط الدائم مطلوب"),
  descriptionAr: z.string().min(10, "الوصف بالعربية مطلوب ويجب أن يكون 10 حروف على الأقل"),
  descriptionEn: z.string().optional(),
  price: z.number().positive("السعر يجب أن يكون رقم موجب"),
  compareAtPrice: z.number().positive().optional().nullable(),
  sku: z.string().min(3, "رمز SKU مطلوب"),
  stock: z.number().int().min(0, "المخزون يجب ألا يقل عن 0"),
  lowStockAlert: z.number().int().min(0).default(5),
  categoryId: z.string().min(1, "التصنيف مطلوب"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
  isBestSeller: z.boolean().default(false),
  images: z.array(z.string().url("رابط صورة غير صالح")).min(1, "صورة واحدة على الأقل مطلوبة"),
  specifications: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

// ==========================================
// Coupon Schema
// ==========================================
export const couponSchema = z.object({
  code: z.string().min(3, "كود الكوبون يجب أن يكون 3 أحرف على الأقل").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("قيمة الخصم يجب أن تكون أكبر من 0"),
  minOrderAmount: z.number().min(0).optional().nullable(),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().positive().default(1),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(true),
});

// ==========================================
// Review Schema
// ==========================================
export const reviewSchema = z.object({
  productId: z.string().min(1, "معرف المنتج مطلوب"),
  rating: z.number().int().min(1).max(5, "التقييم يجب أن يكون بين 1 و 5 نجوم"),
  comment: z.string().min(3, "التعليق يجب أن يحتوي على 3 حروف على الأقل"),
});
