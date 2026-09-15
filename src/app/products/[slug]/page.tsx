import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { getSessionUser } from "@/lib/auth";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductActions } from "@/components/store/product-actions";
import { ProductReviews } from "@/components/store/product-reviews";
import { ProductCard } from "@/components/store/product-card";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";

export interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  const primaryImage = product.images?.[0]?.url;

  return {
    title: product.seoTitle || `${product.nameAr} | سوق النخبة`,
    description: product.seoDescription || product.descriptionAr.slice(0, 160),
    openGraph: {
      title: product.nameAr,
      description: product.descriptionAr.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const user = await getSessionUser();
  const relatedProducts = await ProductService.getRelatedProducts(product.categoryId, product.id, 4);

  const priceNum = Number(product.price);
  const compareAtPriceNum = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent = calculateDiscountPercentage(priceNum, compareAtPriceNum);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameAr,
    image: product.images.map((img) => img.url),
    description: product.descriptionAr,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
      priceCurrency: "SAR",
      price: priceNum,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(product.ratingAverage),
            reviewCount: product.reviewsCount,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-600 transition">
            المنتجات
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-brand-600 transition"
              >
                {product.category.nameAr}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-[200px] dark:text-slate-100">
            {product.nameAr}
          </span>
        </nav>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery (Cols 1-6) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} title={product.nameAr} />
          </div>

          {/* Details & Actions (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.category && (
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full dark:bg-brand-950 dark:text-brand-300">
                    {product.category.nameAr}
                  </span>
                )}
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug dark:text-slate-100">
                {product.nameAr}
              </h1>

              {/* Rating and Verified stats */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {Number(product.ratingAverage || 5).toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  ({product.reviewsCount} تقييم حقيقي)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  أصلي 100%
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-700 dark:text-brand-400">
                {formatPrice(priceNum)}
              </span>
              {compareAtPriceNum && compareAtPriceNum > priceNum && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(compareAtPriceNum)}
                  </span>
                  <span className="text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full dark:bg-rose-950 dark:text-rose-300">
                    وفر {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Product Actions (Client component for interactivity) */}
            <ProductActions
              product={{
                id: product.id,
                nameAr: product.nameAr,
                slug: product.slug,
                price: priceNum,
                compareAtPrice: compareAtPriceNum,
                stock: product.stock,
                images: product.images,
                variants: product.variants,
              }}
            />

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 dark:bg-slate-900 dark:border-slate-800">
                <Truck className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  توصيل سريع
                </p>
                <p className="text-[10px] text-slate-400">خلال 2-4 أيام عمل</p>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 dark:bg-slate-900 dark:border-slate-800">
                <RotateCcw className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  استرجاع مجاني
                </p>
                <p className="text-[10px] text-slate-400">خلال 14 يومًا</p>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 dark:bg-slate-900 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-brand-600 mx-auto" />
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  ضمان سنتين
                </p>
                <p className="text-[10px] text-slate-400">ضمان الوكيل المعتمد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                تفاصيل ووصف المنتج
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed dark:text-slate-300 whitespace-pre-line">
                {product.descriptionAr}
              </div>
            </div>

            {/* Specifications Table */}
            {product.specifications && Array.isArray(product.specifications) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  المواصفات الفنية والتقنية
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {product.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500">{spec.key}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews System */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews as any}
                user={user}
              />
            </div>
          </div>

          {/* Related Products Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              منتجات ذات صلة قد تعجبك
            </h3>
            <div className="space-y-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
