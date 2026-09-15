import Link from "next/link";
import Image from "next/image";
import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowLeft,
  Flame,
  Star,
  ShieldCheck,
  TrendingUp,
  Tag,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  // Fetch real data from services
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let categories: any[] = [];

  try {
    [featuredProducts, newArrivals, bestSellers, categories] = await Promise.all([
      ProductService.getFeaturedProducts(8),
      ProductService.getNewArrivals(8),
      ProductService.getBestSellers(8),
      ProductService.getCategories(),
    ]);
  } catch (error) {
    console.error("Failed to load homepage data:", error);
  }

  // Fallback realistic mock data if database hasn't been seeded yet
  if (categories.length === 0) {
    categories = [
      {
        id: "cat-1",
        nameAr: "الإلكترونيات والذكاء",
        slug: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        _count: { products: 24 },
      },
      {
        id: "cat-2",
        nameAr: "الأزياء والأناقة",
        slug: "fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
        _count: { products: 38 },
      },
      {
        id: "cat-3",
        nameAr: "العطور الفاخرة",
        slug: "perfumes",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&q=80",
        _count: { products: 19 },
      },
      {
        id: "cat-4",
        nameAr: "الساعات الفخمة",
        slug: "watches",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80",
        _count: { products: 15 },
      },
    ];
  }

  if (featuredProducts.length === 0) {
    featuredProducts = [
      {
        id: "prod-1",
        nameAr: "سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء",
        slug: "sony-wh1000xm5",
        price: 1399,
        compareAtPrice: 1599,
        stock: 25,
        ratingAverage: 4.9,
        reviewsCount: 42,
        isFeatured: true,
        category: { nameAr: "الإلكترونيات", slug: "electronics" },
        images: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
        ],
      },
      {
        id: "prod-2",
        nameAr: "عطر ليذر نوار الفاخر الملكي - 100 مل",
        slug: "leather-noir-perfume",
        price: 480,
        compareAtPrice: 620,
        stock: 18,
        ratingAverage: 5.0,
        reviewsCount: 31,
        isFeatured: true,
        category: { nameAr: "العطور الفاخرة", slug: "perfumes" },
        images: [
          { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80" },
        ],
      },
      {
        id: "prod-3",
        nameAr: "ساعة يد أوتوماتيكية كلاسيكية بسوار من الجلد الطبيعي",
        slug: "classic-automatic-watch",
        price: 890,
        compareAtPrice: 1100,
        stock: 12,
        ratingAverage: 4.8,
        reviewsCount: 19,
        isFeatured: true,
        category: { nameAr: "الساعات", slug: "watches" },
        images: [
          { url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80" },
        ],
      },
      {
        id: "prod-4",
        nameAr: "نظارة شمسية بولارايزد بتصميم عصري إيطالي",
        slug: "polarized-sunglasses",
        price: 320,
        compareAtPrice: 450,
        stock: 40,
        ratingAverage: 4.7,
        reviewsCount: 28,
        isFeatured: true,
        category: { nameAr: "الأزياء", slug: "fashion" },
        images: [
          { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80" },
        ],
      },
    ];
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-brand-900/60 border border-brand-700/50 text-brand-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>تشكيلة حصرية لعام 2026 - أصالة وضمان 100%</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight lg:leading-tight">
                اختبر تجربة التسوق <br />
                <span className="bg-gradient-to-r from-emerald-400 via-brand-300 to-amber-300 bg-clip-text text-transparent">
                  الأرقى في الشرق الأوسط
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                مئات المنتجات المختارة بعناية من أشهر العلامات التجارية العالمية، مع سرعة توصيل
                فائقة، وخيارات دفع ميسرة تشمل الدفع عند الاستلام.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="gap-2 font-bold px-8 shadow-xl shadow-brand-600/30">
                    تصفح جميع المنتجات
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products?offers=true">
                  <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                    استكشف عروض اليوم
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-right max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-brand-400">+50,000</p>
                  <p className="text-xs text-slate-400">عميل سعيد وموثق</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-amber-400">100%</p>
                  <p className="text-xs text-slate-400">منتجات أصلية ومضمونة</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-400">24h</p>
                  <p className="text-xs text-slate-400">شحن فائق السرعة</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                  alt="سوق النخبة"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 inset-x-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300">عرض الأسبوع</span>
                    <p className="text-sm font-bold">ساعة بريميوم كرونوغراف</p>
                    <p className="text-xs text-slate-300">خصم 25% لفترة محدودة</p>
                  </div>
                  <Link href="/products/classic-automatic-watch">
                    <Button variant="gold" size="sm">
                      تسوق الآن
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              تسوق حسب الفئات
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر الفئة التي تناسب احتياجاتك وتصفح أحدث ما وصلنا
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 shadow-sm hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700"
            >
              <Image
                src={cat.image || "https://placehold.co/400x300"}
                alt={cat.nameAr}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-white">
                <h3 className="font-bold text-sm sm:text-base group-hover:text-brand-300 transition">
                  {cat.nameAr}
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {cat._count?.products || 15}+ منتج متوفر
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold dark:bg-brand-950 dark:text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                المنتجات المميزة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                مختارات فريقنا لهذا الأسبوع بأعلى تقييمات الجودة
              </p>
            </div>
          </div>
          <Link
            href="/products?featured=true"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            المزيد من المميز
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER SECTION */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase">
              عرض خاص لعملائنا
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight">
              خصم 15% على جميع المشتريات فوق 300 ر.س
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              استخدم كود الخصم في صفحة الدفع واستمتع بشحن مجاني وضمان استرجاع فوري.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-mono font-bold text-amber-300 text-sm">
                ELITE15
              </div>
              <Link href="/products">
                <Button variant="gold">تسوق العرض الآن</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold dark:bg-amber-950 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                الأكثر مبيعاً
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                المنتجات الأكثر طلباً وإشادة من قبل عملائنا
              </p>
            </div>
          </div>
          <Link
            href="/products?sort=bestseller"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            مشاهدة الأكثر طلباً
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(bestSellers.length > 0 ? bestSellers : featuredProducts).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="bg-slate-100/70 py-16 dark:bg-slate-900/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              آراء وتجارب المتسوقين
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              نفخر بثقة آلاف العملاء في جميع أنحاء المملكة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-200">
                "جودة المنتجات مذهلة وسرعة التوصيل في الرياض كانت خلال أقل من 24 ساعة! والتغليف
                فخم جداً يليق باسم سوق النخبة."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">سعود الشمري</p>
                  <p className="text-[10px] text-slate-400">الرياض</p>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  مشتري موثق ✓
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-200">
                "خدمة العملاء متعاونة جداً وسريعة الرد في الواتساب، تجربة الشراء بالدفع عند
                الاستلام كانت مريحة وموثوقة."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">نورة القحطاني</p>
                  <p className="text-[10px] text-slate-400">جدة</p>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  مشتري موثق ✓
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-200">
                "أفضل متجر إلكتروني اشتريت منه هذا العام، المنتجات أصلية مع الضمان، والأسعار
                منافسة جداً."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">محمد الدوسري</p>
                  <p className="text-[10px] text-slate-400">الدمام</p>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  مشتري موثق ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
