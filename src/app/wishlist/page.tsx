"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleMoveToCart = (item: any) => {
    addItem({
      productId: item.id,
      nameAr: item.nameAr,
      slug: item.slug,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      quantity: 1,
      maxStock: item.stock || 10,
    });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500 dark:bg-rose-950">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            قائمة المفضلة فارغة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            احفظ منتجاتك المفضلة بالنقر على رمز القلب أثناء التصفح لتتمكن من الرجوع إليها وشرائها لاحقاً!
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg" className="gap-2">
            استكشف المنتجات
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            قائمة المنتجات المفضلة ({items.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            منتجاتك المحفوظة جاهزة للإضافة المباشرة لسلة الشراء
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearWishlist}
          className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950"
        >
          مسح القائمة
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-white border border-slate-100 p-4 shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3 dark:bg-slate-800">
                <Link href={`/products/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.nameAr}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 text-rose-600 hover:bg-white flex items-center justify-center shadow-sm dark:bg-slate-900/90"
                  title="إزالة من المفضلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand-600 dark:text-slate-100">
                <Link href={`/products/${item.slug}`}>{item.nameAr}</Link>
              </h3>
              <p className="text-sm font-black text-brand-700 mt-1 dark:text-brand-400">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                className="w-full gap-1.5 text-xs font-bold"
                onClick={() => handleMoveToCart(item)}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                نقل إلى السلة
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
