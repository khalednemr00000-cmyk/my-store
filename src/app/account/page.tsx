import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { OrderService } from "@/services/order.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from "lucide-react";

export const metadata = {
  title: "حسابي الشخصي | سوق النخبة",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  const orders = await OrderService.getUserOrders(user.id);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Account Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-600/30">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              مرحباً بك، {user.name}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            {user.role !== "CUSTOMER" && (
              <span className="inline-block mt-2 text-[10px] bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full font-bold border border-brand-200 dark:bg-brand-950 dark:text-brand-300">
                صلاحية مشرف: {user.role}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role !== "CUSTOMER" && (
            <Link href="/admin">
              <Button variant="gold" size="sm" className="gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4" />
                لوحة تحكم المشرف
              </Button>
            </Link>
          )}
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </form>
        </div>
      </div>

      {/* Account Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-brand-500 hover:shadow-lg transition p-6 space-y-3 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center dark:bg-brand-950 dark:text-brand-400">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            طلباتي ({orders.length})
          </h3>
          <p className="text-xs text-slate-500">
            تتبع الشحنات، استعراض تفاصيل وتاريخ الطلبات السابقة
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-rose-500 hover:shadow-lg transition p-6 space-y-3 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center dark:bg-rose-950 dark:text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            قائمة المفضلة
          </h3>
          <p className="text-xs text-slate-500">
            المنتجات التي قمت بحفظها لشرائها في أي وقت
          </p>
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center dark:bg-slate-800 dark:text-slate-300">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            البيانات الشخصية
          </h3>
          <p className="text-xs text-slate-500">
            رقم الهاتف: {user.phone || "غير مسجل"}
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            أحدث الطلبات
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            مشاهدة جميع الطلبات
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs text-slate-500">لم تقم بإجراء أي طلبات حتى الآن.</p>
            <Link
              href="/products"
              className="inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              ابدأ التسوق الآن
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="py-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                    #{ord.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(ord.createdAt)} • {ord.items.length} منتجات
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-brand-700 dark:text-brand-400">
                    {formatPrice(Number(ord.totalAmount))}
                  </span>
                  <Link href={`/orders/${ord.orderNumber}`}>
                    <Button variant="outline" size="sm">
                      عرض الطلب
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
