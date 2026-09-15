import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/store/product-card";
import Link from "next/link";
import { Filter, SlidersHorizontal, ArrowRight, ArrowLeft } from "lucide-react";

export interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating" | "bestseller";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page || 1);

  let productsResult = {
    items: [] as any[],
    total: 0,
    page: currentPage,
    totalPages: 1,
  };
  let categories: any[] = [];

  try {
    [productsResult, categories] = await Promise.all([
      ProductService.getProducts({
        search: params.search,
        categorySlug: params.category,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        inStock: params.inStock === "true",
        sortBy: params.sort || "newest",
        page: currentPage,
        limit: 12,
      }),
      ProductService.getCategories(),
    ]);
  } catch (err) {
    console.error("Failed to query products:", err);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold dark:text-slate-100">جميع المنتجات</span>
          {params.search && (
            <>
              <span>/</span>
              <span className="text-brand-600">نتائج البحث عن: "{params.search}"</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              متجر سوق النخبة
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              عرض {productsResult.items.length} من أصل {productsResult.total} منتج
            </p>
          </div>

          {/* Sorting Dropdown Form */}
          <form method="GET" className="flex items-center gap-2">
            {params.search && <input type="hidden" name="search" value={params.search} />}
            {params.category && <input type="hidden" name="category" value={params.category} />}
            <span className="text-xs text-slate-500 whitespace-nowrap">الترتيب حسب:</span>
            <select
              name="sort"
              defaultValue={params.sort || "newest"}
              // Auto-submit on change
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="newest">الأحدث وصولاً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="bestseller">الأكثر مبيعاً</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              ترتيب
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters (Cols 1-3) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>تصفية النتائج</span>
              </div>
              <Link
                href="/products"
                className="text-[11px] text-slate-400 hover:text-rose-600 transition"
              >
                إعادة ضبط
              </Link>
            </div>

            {/* Categories filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                التصنيفات
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/products"
                    className={`block px-2.5 py-1.5 rounded-lg transition ${
                      !params.category
                        ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-950 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    جميع الأقسام
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                        params.category === cat.slug
                          ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-950 dark:text-brand-300"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{cat.nameAr}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full dark:bg-slate-800">
                        {cat._count?.products || 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                نطاق السعر (ر.س)
              </h4>
              <form method="GET" className="space-y-3">
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {params.search && <input type="hidden" name="search" value={params.search} />}
                {params.sort && <input type="hidden" name="sort" value={params.sort} />}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="من"
                    defaultValue={params.minPrice}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="إلى"
                    defaultValue={params.maxPrice}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition"
                >
                  تطبيق السعر
                </button>
              </form>
            </div>

            {/* In Stock toggle */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/products?${new URLSearchParams({
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.inStock === "true" ? {} : { inStock: "true" }),
                }).toString()}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={params.inStock === "true"}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>المنتجات المتوفرة فقط بالمخزون</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Products Grid & Pagination (Cols 4-12) */}
        <main className="lg:col-span-9 space-y-8">
          {productsResult.items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 dark:bg-slate-800">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                لم يتم العثور على أي منتجات مطابقة للبحث
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                يرجى تجربة كلمات بحث أخرى أو إزالة بعض الفلاتر لعرض مزيد من النتائج.
              </p>
              <Link
                href="/products"
                className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                مسح جميع الفلاتر
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {productsResult.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {productsResult.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/products?page=${currentPage - 1}`}
                  className="p-2 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold hover:bg-slate-50 flex items-center gap-1 dark:border-slate-700 dark:bg-slate-900"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  السابق
                </Link>
              )}

              {Array.from({ length: productsResult.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={`/products?page=${pageNum}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      isCurrent
                        ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < productsResult.totalPages && (
                <Link
                  href={`/products?page=${currentPage + 1}`}
                  className="p-2 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold hover:bg-slate-50 flex items-center gap-1 dark:border-slate-700 dark:bg-slate-900"
                >
                  التالي
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
