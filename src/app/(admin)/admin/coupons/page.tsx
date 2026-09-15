import { AdminService } from "@/services/admin.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { CouponFormModal } from "./coupon-form-modal";

export const metadata = {
  title: "إدارة الكوبونات والخصومات | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await AdminService.getCoupons();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            كوبونات وقسائم الخصم ({coupons.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وإدارة رموز التخفيض، والتحكم في حدود الاستخدام وفترات الصلاحية
          </p>
        </div>

        <CouponFormModal />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pr-5">كود الكوبون</th>
                <th className="p-3.5">قيمة الخصم</th>
                <th className="p-3.5">الحد الأدنى للطلب</th>
                <th className="p-3.5">الاستخدام</th>
                <th className="p-3.5">تاريخ الانتهاء</th>
                <th className="p-3.5 pl-5">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    لا توجد كوبونات مضافة حتى الآن.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 pr-5 font-mono font-bold text-brand-700 dark:text-brand-400">
                      {c.code}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {c.discountType === "PERCENTAGE"
                        ? `${c.discountValue}%`
                        : formatPrice(Number(c.discountValue))}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {c.minOrderAmount ? formatPrice(Number(c.minOrderAmount)) : "بدون حد أدنى"}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {c.usedCount}
                      </span>
                      {c.usageLimit && (
                        <span className="text-slate-400 text-[10px]"> / {c.usageLimit}</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500">{formatDate(c.endDate)}</td>
                    <td className="p-3.5 pl-5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive && new Date(c.endDate) > new Date()
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {c.isActive && new Date(c.endDate) > new Date() ? "فعال" : "منتهي"}
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
