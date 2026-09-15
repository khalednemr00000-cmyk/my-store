import Link from "next/link";
import { AdminService } from "@/services/admin.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowLeft,
  Printer,
  ChevronLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const {
    totalSales,
    ordersCount,
    customersCount,
    productsCount,
    lowStockProducts,
    recentOrders,
  } = await AdminService.getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            لوحة الإحصائيات العامة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حية ومحدثة للمبيعات، الطلبات، المخزون، ونشاط المتجر
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="gap-1.5 font-bold">
              <Package className="w-4 h-4" />
              إضافة منتج جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatPrice(totalSales)}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">من جميع الطلبات المؤكدة</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">عدد الطلبات</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950 dark:text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {ordersCount}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">طلبات مسجلة</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي العملاء</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center dark:bg-sky-950 dark:text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {customersCount}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">حسابات نشطة</p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">عدد المنتجات</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950 dark:text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {productsCount}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">في الكتالوج</p>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                أحدث الطلبات
              </h3>
              <p className="text-xs text-slate-400">متابعة فورية للطلبات الواردة</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 pr-5">رقم الطلب</th>
                  <th className="p-3.5">العميل</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">المبلغ</th>
                  <th className="p-3.5 pl-5">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      لا توجد طلبات مسجلة بعد.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 pr-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        #{ord.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="text-slate-900 font-bold dark:text-slate-100">
                          {ord.customerName}
                        </p>
                        <p className="text-[10px] text-slate-400">{ord.customerPhone}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(Number(ord.totalAmount))}
                      </td>
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/orders/${ord.orderNumber}`}
                            className="text-brand-600 hover:underline font-bold"
                          >
                            عرض
                          </Link>
                          <Link
                            href={`/admin/orders/${ord.id}/invoice`}
                            target="_blank"
                            className="text-slate-400 hover:text-slate-600"
                            title="طباعة الفاتورة"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-bold">تنبيهات المخزون المنخفض</h3>
            </div>
            <p className="text-xs text-slate-500">
              منتجات أوشكت على النفاد وتحتاج إلى إعادة توريد فورية:
            </p>

            <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {lowStockProducts.length === 0 ? (
                <p className="text-slate-400 text-center py-4">
                  جميع المنتجات متوفرة بكميات آمنة ✓
                </p>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                        {p.nameAr}
                      </p>
                      <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                    </div>
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[11px] border border-rose-200">
                      متبقي {p.stock}
                    </span>
                  </div>
                ))
              )}
            </div>

            <Link href="/admin/products" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                إدارة كافة المنتجات والمخزون
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
