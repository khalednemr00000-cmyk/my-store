import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/store/product-card";

export interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sort?: "newest" | "price_asc" | "price_desc" | "rating" | "bestseller";
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await ProductService.getCategoryBySlug(slug);

  if (!category) return { title: "التصنيف غير موجود" };

  return {
    title: `${category.nameAr} | سوق النخبة`,
    description: category.description || `تصفح أحدث وأفضل منتجات ${category.nameAr} في سوق النخبة.`,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Number(sParams.page || 1);

  const category = await ProductService.getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const productsResult = await ProductService.getProducts({
    categorySlug: slug,
    sortBy: sParams.sort || "newest",
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-brand-300">
          <Link href="/" className="hover:underline">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:underline">
            التصنيفات
          </Link>
          <span>/</span>
          <span className="text-white font-bold">{category.nameAr}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">{category.nameAr}</h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <p className="text-xs text-slate-500">
          عرض {productsResult.items.length} من {productsResult.total} منتج
        </p>

        <form method="GET" className="flex items-center gap-2">
          <span className="text-xs text-slate-500">الترتيب:</span>
          <select
            name="sort"
            defaultValue={sParams.sort || "newest"}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="newest">الأحدث</option>
            <option value="price_asc">الأقل سعراً</option>
            <option value="price_desc">الأعلى سعراً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
          >
            تطبيق
          </button>
        </form>
      </div>

      {/* Products Grid */}
      {productsResult.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            لا توجد منتجات مضافة في هذا التصنيف حالياً
          </p>
          <Link
            href="/products"
            className="inline-block text-xs font-bold text-brand-600 hover:underline"
          >
            تصفح باقي الأقسام
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {productsResult.items.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
