import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { OrderService } from "@/services/order.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const orders = await OrderService.getUserOrders(user.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            سجل طلباتي
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            استعرض وتتبع جميع الطلبات التي قمت بشرائها من المتجر
          </p>
        </div>

        <Link
          href="/account"
          className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <ArrowRight className="w-4 h-4" />
          العودة لحسابي
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            لا توجد طلبات مسجلة في حسابك حتى الآن
          </p>
          <Link href="/products">
            <Button variant="primary" size="sm">
              تصفح المنتجات وابدأ الشراء
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  تاريخ الطلب: {formatDate(order.createdAt)} • {order.items.length} منتجات
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-base font-extrabold text-brand-700 dark:text-brand-400">
                  {formatPrice(Number(order.totalAmount))}
                </span>
                <Link href={`/orders/${order.orderNumber}`}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    تفاصيل ومسار الطلب
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
