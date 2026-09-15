"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  product: {
    id: string;
    nameAr: string;
    slug: string;
    price: number | any;
    compareAtPrice?: number | any | null;
    stock: number;
    ratingAverage?: number | any;
    reviewsCount?: number;
    isNewArrival?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    category?: { nameAr: string; slug: string };
    images: Array<{ url: string; altText?: string | null }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isAdded, setIsAdded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const priceNum = Number(product.price);
  const compareAtPriceNum = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent = calculateDiscountPercentage(priceNum, compareAtPriceNum);
  const primaryImage = product.images?.[0]?.url || "https://placehold.co/400x400/png?text=Product";
  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      nameAr: product.nameAr,
      slug: product.slug,
      price: priceNum,
      compareAtPrice: compareAtPriceNum,
      image: primaryImage,
      quantity: 1,
      maxStock: product.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id: product.id,
      nameAr: product.nameAr,
      slug: product.slug,
      price: priceNum,
      compareAtPrice: compareAtPriceNum,
      image: primaryImage,
      stock: product.stock,
    });
  };

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-100 p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-3 dark:bg-slate-800">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.nameAr}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <Badge variant="danger" className="font-bold">
                خصم {discountPercent}%
              </Badge>
            )}
            {product.isNewArrival && !discountPercent && (
              <Badge variant="brand">جديد</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="gold">الأكثر طلباً</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm z-10 ${
              inWishlist
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950"
                : "bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white dark:bg-slate-900/90 dark:text-slate-300"
            }`}
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Category & Title */}
        <div className="space-y-1">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-[11px] font-medium text-slate-400 hover:text-brand-600 transition"
            >
              {product.category.nameAr}
            </Link>
          )}

          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-brand-600 transition dark:text-slate-100">
            <Link href={`/products/${product.slug}`}>{product.nameAr}</Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-500 pt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {Number(product.ratingAverage || 5).toFixed(1)}
            </span>
            <span className="text-slate-400 text-[10px]">
              ({product.reviewsCount || 12})
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between gap-2 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-base font-extrabold text-brand-700 dark:text-brand-400">
            {formatPrice(priceNum)}
          </span>
          {compareAtPriceNum && compareAtPriceNum > priceNum && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(compareAtPriceNum)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 shadow-sm ${
            isAdded
              ? "bg-emerald-600 text-white"
              : product.stock <= 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800"
              : "bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-600 dark:hover:text-white"
          }`}
          aria-label="إضافة إلى السلة"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>تمت الإضافة!</span>
            </>
          ) : product.stock <= 0 ? (
            <span>نفد</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>أضف</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
