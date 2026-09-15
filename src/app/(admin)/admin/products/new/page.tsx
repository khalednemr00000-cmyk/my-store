import { ProductService } from "@/services/product.service";
import { AdminProductForm } from "./form";

export const metadata = {
  title: "إضافة منتج جديد | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categoriesData = await ProductService.getCategories();
  const categories = categoriesData.map((c) => ({ id: c.id, nameAr: c.nameAr }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          إضافة منتج جديد للكتالوج
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          أدخل بيانات المنتج والصور والأسعار وتفاصيل المخزون والمواصفات
        </p>
      </div>

      <AdminProductForm categories={categories} />
    </div>
  );
}
