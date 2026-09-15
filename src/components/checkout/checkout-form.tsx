"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Tag,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";

export interface CheckoutFormProps {
  user?: any;
  shippingMethods: Array<{
    id: string;
    nameAr: string;
    cost: number;
    freeThreshold?: number | null;
    estimatedDelivery: string;
  }>;
}

export function CheckoutForm({ user, shippingMethods }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Step 1: Address Data
  const [recipientName, setRecipientName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [city, setCity] = React.useState("الرياض");
  const [region, setRegion] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [building, setBuilding] = React.useState("");

  // Step 2: Shipping & Payment
  const [selectedShippingId, setSelectedShippingId] = React.useState(
    shippingMethods[0]?.id || "standard-shipping"
  );
  const [paymentMethod, setPaymentMethod] = React.useState<
    "CASH_ON_DELIVERY" | "STRIPE" | "PAYPAL"
  >("CASH_ON_DELIVERY");

  // Step 3: Coupon
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Shipping calculation
  const currentShipping =
    shippingMethods.find((m) => m.id === selectedShippingId) || shippingMethods[0];
  const isFreeShipping = Boolean(
    currentShipping?.freeThreshold && subtotal >= currentShipping.freeThreshold
  );
  const shippingCost = isFreeShipping ? 0 : currentShipping?.cost || 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          message: data.message,
        });
      } else {
        setCouponError(data.message || "كود الخصم غير صالح");
      }
    } catch {
      setCouponError("حدث خطأ أثناء فحص الكوبون");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
        shippingAddress: {
          recipientName,
          phone,
          city,
          region,
          street,
          building,
        },
        paymentMethod,
        shippingMethodId: selectedShippingId,
        couponCode: appliedCoupon?.code,
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        router.push(`/orders/${data.order.orderNumber}`);
      } else {
        setErrorMsg(data.error || "فشل في إتمام الطلب، يرجى المحاولة مرة أخرى.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء معالجة الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          سلة مشترياتك فارغة!
        </h2>
        <p className="text-xs text-slate-500">
          يرجى إضافة منتجات إلى السلة قبل المتابعة إلى صفحة الدفع.
        </p>
        <Button onClick={() => router.push("/products")}>العودة للتسوق</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Steps (Cols 1-7) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1
                  ? "bg-brand-600 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              عنوان التوصيل
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2
                  ? "bg-brand-600 text-white"
                  : step > 2
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              الشحن والدفع
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              المراجعة والتأكيد
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Address */}
        {step === 1 && (
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              بيانات المستلم وعنوان التوصيل
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="الاسم الكامل *"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="أحمد محمد"
                required
              />
              <Input
                label="رقم الهاتف للتواصل والتوصيل *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                required
              />
            </div>
            <Input
              label="البريد الإلكتروني (لتلقي تفاصيل الفاتورة)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  المدينة *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="الخبر">الخبر</option>
                  <option value="أبها">أبها</option>
                  <option value="تبوك">تبوك</option>
                  <option value="حائل">حائل</option>
                  <option value="أخرى">مدينة أخرى</option>
                </select>
              </div>
              <Input
                label="الحي أو المنطقة *"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="حي العليا"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="اسم الشارع *"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="شارع التحلية"
                required
              />
              <Input
                label="رقم المبنى / الشقة (اختياري)"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="عمارة 12 - شقة 4"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  if (!recipientName || !phone || !city || !region || !street) {
                    setErrorMsg("يرجى تعبئة كافة الحقول المطلوبة التي تحتوي على علامة (*)");
                    return;
                  }
                  setErrorMsg("");
                  setStep(2);
                }}
                className="gap-2"
              >
                متابعة لاختيار الشحن والدفع
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Shipping & Payment */}
        {step === 2 && (
          <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            {/* Shipping Methods */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. اختر شركة وطريقة الشحن:
              </h3>
              <div className="space-y-2">
                {shippingMethods.map((method) => {
                  const free = method.freeThreshold && subtotal >= method.freeThreshold;
                  const isSelected = selectedShippingId === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? "border-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                          : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={isSelected}
                          onChange={() => setSelectedShippingId(method.id)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {method.nameAr}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            تاريخ الوصول المتوقع: {method.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-700 dark:text-brand-400">
                        {free ? "مجاناً 🎁" : formatPrice(method.cost)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                2. اختر طريقة الدفع:
              </h3>
              <div className="space-y-2">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          الدفع عند الاستلام (COD)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ادفع نقداً أو عبر البطاقة عند استلام الشحنة
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Credit Card / Stripe */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "STRIPE"
                      ? "border-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "STRIPE"}
                      onChange={() => setPaymentMethod("STRIPE")}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          بطاقة ائتمانية / مدى (آمن ومشفر)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          فيزا، ماستركارد، مدى مع معالجة Stripe السريعة
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* PayPal */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "PAYPAL"
                      ? "border-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "PAYPAL"}
                      onChange={() => setPaymentMethod("PAYPAL")}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        حساب باي بال (PayPal)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        الدفع السريع والحماية للمتسوقين
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                الرجوع للعنوان
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="gap-2"
              >
                متابعة لمراجعة وتأكيد الطلب
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Place Order */}
        {step === 3 && (
          <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              مراجعة الطلب والملاحظات
            </h3>

            {/* Summary details */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">المستلم:</span>
                <span className="font-bold">{recipientName} ({phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">عنوان التوصيل:</span>
                <span className="font-bold">{city} - {region} - {street}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">طريقة الدفع:</span>
                <span className="font-bold">
                  {paymentMethod === "CASH_ON_DELIVERY"
                    ? "الدفع عند الاستلام"
                    : paymentMethod === "STRIPE"
                    ? "بطاقة مدى / ائتمان"
                    : "PayPal"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ملاحظات إضافية للتوصيل (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                تعديل الشحن والدفع
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onClick={handlePlaceOrder}
                className="gap-2 font-bold px-8 shadow-lg shadow-brand-600/20"
              >
                <Lock className="w-4 h-4" />
                تأكيد وإتمام الطلب ({formatPrice(grandTotal)})
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary & Coupon (Cols 8-12) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">
            ملخص الطلب ({items.reduce((s, i) => s + i.quantity, 0)} منتجات)
          </h3>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate dark:text-slate-200">
                      {item.nameAr}
                    </p>
                    <p className="text-[10px] text-slate-400">الكمية: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100 flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="كود الخصم (الكوبون)..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono uppercase focus:bg-white focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isValidatingCoupon}
                onClick={handleApplyCoupon}
              >
                تطبيق
              </Button>
            </div>
            {couponError && (
              <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
            )}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                <span>تم تفعيل الكوبون: {appliedCoupon.code}</span>
                <span className="font-bold">-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>المجموع الفرعي للمنتجات:</span>
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>الخصم المطبق:</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>تكلفة الشحن والتوصيل:</span>
              <span className="font-bold">
                {isFreeShipping ? "شحن مجاني 🚚" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100">
              <span>الإجمالي النهائي:</span>
              <span className="text-brand-700 text-lg dark:text-brand-400">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>تسوقك آمن 100% ومحمي بتشفير SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
