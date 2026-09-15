import Link from "next/link";
import Image from "next/image";
import { AdminService } from "@/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export const metadata = {
  title: "إدارة المنتجات | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await AdminService.getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            إدارة كتالوج المنتجات ({products.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إضافة، تعديل، متابعة المخزون، والتحكم في تفعيل المنتجات
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" className="gap-2 font-bold">
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pr-5">المنتج</th>
                <th className="p-3.5">التصنيف</th>
                <th className="p-3.5">السعر</th>
                <th className="p-3.5">المخزون</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5 pl-5">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    لا توجد منتجات مسجلة في المتجر حتى الآن.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 pr-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={p.images[0]?.url || "https://placehold.co/80x80"}
                            alt={p.nameAr}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-[200px]">
                            {p.nameAr}
                          </p>
                          <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {p.category?.nameAr || "-"}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(Number(p.price))}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          p.stock > 5
                            ? "bg-emerald-50 text-emerald-700"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.stock} متوفر
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isActive ? "نشط" : "مسودة"}
                      </span>
                    </td>
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="معاينة في المتجر"
                        >
                          <Eye className="w-4 h-4" />
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
    </div>
  );
}
