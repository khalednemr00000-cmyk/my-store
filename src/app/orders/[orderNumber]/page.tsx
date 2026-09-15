import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { OrderService } from "@/services/order.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export interface OrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const order = await OrderService.getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const statusSteps = [
    { key: "PENDING", label: "تم استلام الطلب", icon: Clock },
    { key: "CONFIRMED", label: "تم التأكيد", icon: CheckCircle2 },
    { key: "PROCESSING", label: "جاري التجهيز", icon: Package },
    { key: "SHIPPED", label: "تم الشحن", icon: Truck },
    { key: "DELIVERED", label: "تم التوصيل", icon: CheckCircle2 },
  ];

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === order.status);
  const activeIndex = currentStatusIndex !== -1 ? currentStatusIndex : 0;
  const shippingSnap = order.shippingSnapshot as any;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      {/* Success Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 dark:bg-emerald-950/40 dark:border-emerald-900">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          شكراً لك، تم تأكيد طلبك بنجاح!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          رقم الطلب الخاص بك هو{" "}
          <strong className="text-emerald-700 font-mono text-sm sm:text-base dark:text-emerald-400">
            #{order.orderNumber}
          </strong>
          . تم إرسال تفاصيل الفاتورة والمتابعة إلى بريدك الإلكتروني.
        </p>
      </div>

      {/* Order Status Timeline Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6">
          حالة ومسار شحنة الطلب:
        </h3>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          {statusSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center z-10 w-full sm:w-auto">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-right sm:text-center">
                  <p
                    className={`text-xs font-bold ${
                      isCurrent
                        ? "text-brand-600 dark:text-brand-400"
                        : isCompleted
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">
            المنتجات المطلوبة ({order.items.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <Image
                      src={
                        item.product?.images?.[0]?.url ||
                        "https://placehold.co/100x100/png?text=Product"
                      }
                      alt={item.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate text-xs">
                    <p className="font-bold text-slate-900 truncate dark:text-slate-100">
                      {item.nameAr}
                    </p>
                    <p className="text-slate-400 mt-0.5">
                      {formatPrice(Number(item.unitPrice))} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex-shrink-0">
                  {formatPrice(Number(item.total))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Summary (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">
              تفاصيل الفاتورة
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>تاريخ الطلب:</span>
                <span className="font-bold">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-bold">{formatPrice(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>الخصم:</span>
                  <span>-{formatPrice(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>الشحن والتوصيل:</span>
                <span className="font-bold">
                  {Number(order.shippingCost) === 0
                    ? "مجاناً 🚚"
                    : formatPrice(Number(order.shippingCost))}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100 dark:text-slate-100 dark:border-slate-800">
                <span>المبلغ الإجمالي:</span>
                <span className="text-brand-700 dark:text-brand-400">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
            </div>

            {/* Address Snapshot */}
            {shippingSnap && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  عنوان التوصيل:
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {shippingSnap.recipientName} ({shippingSnap.phone})
                </p>
                <p className="text-slate-500">
                  {shippingSnap.city} - {shippingSnap.region} - {shippingSnap.street}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            مواصلة التسوق
          </Button>
        </Link>
        <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
          <Button variant="primary" className="gap-2">
            <Printer className="w-4 h-4" />
            طباعة الفاتورة الضريبية
          </Button>
        </Link>
      </div>
    </div>
  );
}
