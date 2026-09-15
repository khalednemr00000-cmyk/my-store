"use client";

import * as React from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { Printer, ExternalLink, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminOrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = React.useState(initialOrders);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      alert("فشل تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentChange = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o
          )
        );
      }
    } catch {
      alert("فشل تحديث حالة الدفع");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
            <tr>
              <th className="p-3.5 pr-5">رقم الطلب</th>
              <th className="p-3.5">العميل والتاريخ</th>
              <th className="p-3.5">حالة الشحنة</th>
              <th className="p-3.5">حالة الدفع</th>
              <th className="p-3.5">المبلغ الإجمالي</th>
              <th className="p-3.5 pl-5">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  لا توجد طلبات مسجلة حالياً.
                </td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3.5 pr-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    #{ord.orderNumber}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {ord.customerName}
                    </p>
                    <p className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</p>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={ord.status}
                      disabled={updatingId === ord.id}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-[11px] font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="PENDING">قيد الانتظار (Pending)</option>
                      <option value="CONFIRMED">تم التأكيد (Confirmed)</option>
                      <option value="PROCESSING">جاري التجهيز (Processing)</option>
                      <option value="SHIPPED">تم الشحن (Shipped)</option>
                      <option value="DELIVERED">تم التوصيل (Delivered)</option>
                      <option value="CANCELLED">ملغي (Cancelled)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={ord.paymentStatus}
                      disabled={updatingId === ord.id}
                      onChange={(e) => handlePaymentChange(ord.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-[11px] font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value="PENDING">معلق (Pending)</option>
                      <option value="PAID">مدفوع (Paid)</option>
                      <option value="FAILED">فاشل (Failed)</option>
                      <option value="REFUNDED">مسترجع (Refunded)</option>
                    </select>
                  </td>
                  <td className="p-3.5 font-black text-slate-900 dark:text-slate-100">
                    {formatPrice(Number(ord.totalAmount))}
                  </td>
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="text-brand-600 hover:underline font-bold"
                      >
                        معاينة
                      </Link>
                      <Link
                        href={`/admin/orders/${ord.id}/invoice`}
                        target="_blank"
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                        title="طباعة الفاتورة"
                      >
                        <Printer className="w-4 h-4" />
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
  );
}
