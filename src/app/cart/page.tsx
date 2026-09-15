"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [couponMessage, setCouponMessage] = React.useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = React.useState(false);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 200;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    setCouponMessage("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(data.discountAmount);
        setCouponMessage(`تم تفعيل الخصم: ${data.discountAmount} ر.س`);
      } else {
        setDiscountAmount(0);
        setCouponMessage(data.message || "الكوبون غير صالح");
      }
    } catch {
      setCouponMessage("تعذر فحص الكوبون");
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 dark:bg-slate-800">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            سلة المشتريات فارغة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            لم تقم بإضافة أي منتجات إلى سلتك حتى الآن. استكشف مجموعاتنا الرائعة وابدأ تجربة التسوق!
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg" className="gap-2">
            ابدأ التسوق الآن
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            سلة المشتريات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            لديك {items.reduce((s, i) => s + i.quantity, 0)} منتجات في سلتك
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <ArrowRight className="w-4 h-4" />
          متابعة التسوق
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
                    <Image
                      src={item.image}
                      alt={item.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-slate-100">
                      <Link href={`/products/${item.slug}`}>{item.nameAr}</Link>
                    </h3>
                    {item.variantAttributes && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {Object.values(item.variantAttributes).join(" / ")}
                      </p>
                    )}
                    <p className="text-sm font-bold text-brand-600 mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden dark:border-slate-700">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800 dark:text-slate-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-900 min-w-[80px] text-left dark:text-slate-100">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Box (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">
              ملخص الحساب
            </h3>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود الخصم..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono uppercase focus:bg-white focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={isCheckingCoupon}
                  onClick={handleApplyCoupon}
                >
                  تطبيق
                </Button>
              </div>
              {couponMessage && (
                <p
                  className={`text-[11px] font-semibold ${
                    discountAmount > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>الخصم:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>الشحن والتوصيل:</span>
                <span className="font-bold">
                  {isFreeShipping ? "مجاني 🚚" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100 dark:text-slate-100 dark:border-slate-800">
                <span>الإجمالي:</span>
                <span className="text-brand-700 text-lg dark:text-brand-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full pt-2">
              <Button variant="primary" size="lg" className="w-full gap-2 font-bold shadow-md">
                التقدم لإتمام الشراء
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفع مشفر وآمن 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
