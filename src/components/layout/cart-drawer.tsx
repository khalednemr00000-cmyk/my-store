"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const freeShippingThreshold = 200;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-16">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col dark:bg-slate-900">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                سلة المشتريات ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition dark:hover:bg-slate-800"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-brand-50/70 p-3 border-b border-brand-100 text-xs text-brand-900 dark:bg-brand-950/40 dark:border-brand-900 dark:text-brand-300">
            {freeShippingRemaining > 0 ? (
              <p className="mb-1.5 font-medium">
                أضف منتجات بقيمة{" "}
                <span className="font-bold text-brand-700 dark:text-brand-400">
                  {formatPrice(freeShippingRemaining)}
                </span>{" "}
                للحصول على <span className="font-bold">شحن مجاني! 🚚</span>
              </p>
            ) : (
              <p className="mb-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                🎉 مبروك! لقد حصلت على شحن مجاني لطلبك!
              </p>
            )}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden dark:bg-slate-800">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-800">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    سلة المشتريات فارغة
                  </p>
                  <p className="text-xs text-slate-500">
                    تصفح منتجاتنا المميزة وابدأ بإضافة اختياراتك المفضلة!
                  </p>
                </div>
                <Button
                  onClick={() => toggleCart(false)}
                  variant="outline"
                  className="mt-2"
                >
                  تصفح المنتجات
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 dark:bg-slate-800 dark:border-slate-800">
                    <Image
                      src={item.image || "https://placehold.co/100x100"}
                      alt={item.nameAr}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 truncate dark:text-slate-100">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => toggleCart(false)}
                          className="hover:text-brand-600"
                        >
                          {item.nameAr}
                        </Link>
                      </h4>
                      {item.variantAttributes && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {Object.values(item.variantAttributes).join(" / ")}
                        </p>
                      )}
                      <p className="text-sm font-bold text-brand-600 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden dark:border-slate-700">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 px-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800 dark:text-slate-300"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  المجموع الفرعي:
                </span>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                يتم حساب تكاليف الشحن والضرائب والكوبونات عند إتمام الطلب.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => toggleCart(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    عرض السلة
                  </Button>
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => toggleCart(false)}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full gap-2">
                    إتمام الشراء
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
