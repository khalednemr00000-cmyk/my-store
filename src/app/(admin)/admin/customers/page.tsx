import { AdminService } from "@/services/admin.service";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Phone, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "إدارة العملاء | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await AdminService.getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          إدارة العملاء المسجلين ({customers.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          بيانات العملاء، سجل الطلبات السابقة، والتواصل
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pr-5">العميل</th>
                <th className="p-3.5">البريد الإلكتروني</th>
                <th className="p-3.5">رقم الهاتف</th>
                <th className="p-3.5">عدد الطلبات</th>
                <th className="p-3.5">تاريخ الانضمام</th>
                <th className="p-3.5 pl-5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    لا يوجد عملاء مسجلين حتى الآن.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 pr-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs dark:bg-brand-950 dark:text-brand-300">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{c.email}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{c.phone || "-"}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full dark:bg-brand-950 dark:text-brand-400">
                        {c._count.orders} طلبات
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{formatDate(c.createdAt)}</td>
                    <td className="p-3.5 pl-5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        نشط ✓
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
