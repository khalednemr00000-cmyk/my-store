"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Button } from "@/components/ui/button";
import { VariantPicker, Variant } from "./variant-picker";
import { ShoppingBag, Zap, Heart, Share2, Check, Plus, Minus } from "lucide-react";

export interface ProductActionsProps {
  product: {
    id: string;
    nameAr: string;
    slug: string;
    price: number | any;
    compareAtPrice?: number | any | null;
    stock: number;
    images: Array<{ url: string }>;
    variants?: Variant[];
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = React.useState(1);
  const [selectedVariant, setSelectedVariant] = React.useState<Variant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [copied, setCopied] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentPrice = selectedVariant?.price ? Number(selectedVariant.price) : Number(product.price);
  const primaryImage = product.images?.[0]?.url || "https://placehold.co/400x400";
  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = (redirectAfter = false) => {
    if (currentStock <= 0) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant ? selectedVariant.id : null,
      nameAr: selectedVariant ? `${product.nameAr} (${selectedVariant.nameAr})` : product.nameAr,
      slug: product.slug,
      price: currentPrice,
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      image: primaryImage,
      quantity,
      maxStock: currentStock,
      variantAttributes: selectedVariant?.attributes,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    if (redirectAfter) {
      router.push("/checkout");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nameAr,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <VariantPicker
          variants={product.variants}
          selectedVariantId={selectedVariant?.id}
          onSelectVariant={(v) => {
            setSelectedVariant(v);
            setQuantity(1);
          }}
        />
      )}

      {/* Quantity & Stock status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-3 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
            aria-label="إنقاص الكمية"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-slate-100">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={quantity >= currentStock}
            className="p-3 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
            aria-label="زيادة الكمية"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs">
          {currentStock > 10 ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              متوفر في المخزون
            </span>
          ) : currentStock > 0 ? (
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              متبقي {currentStock} قطع فقط! سارع بالشراء
            </span>
          ) : (
            <span className="text-rose-600 font-bold">المنتج نفد حالياً من المخزون</span>
          )}
        </div>
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={currentStock <= 0}
          onClick={() => handleAddToCart(false)}
          className="w-full gap-2 text-base font-bold shadow-lg shadow-brand-600/20"
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              تمت الإضافة للسلة!
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              أضف إلى السلة
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="gold"
          size="lg"
          disabled={currentStock <= 0}
          onClick={() => handleAddToCart(true)}
          className="w-full gap-2 text-base"
        >
          <Zap className="w-5 h-5" />
          شراء الآن بضغطة واحدة
        </Button>
      </div>

      {/* Extra Actions (Wishlist & Share) */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              id: product.id,
              nameAr: product.nameAr,
              slug: product.slug,
              price: currentPrice,
              compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
              image: primaryImage,
              stock: currentStock,
            })
          }
          className={`flex items-center gap-1.5 text-xs font-semibold p-2 rounded-xl border transition ${
            inWishlist
              ? "border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900"
              : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
          <span>{inWishlist ? "في قائمة المفضلة" : "إضافة للمفضلة"}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 transition dark:border-slate-700 dark:text-slate-300"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? "تم نسخ الرابط!" : "مشاركة المنتج"}</span>
        </button>
      </div>
    </div>
  );
}
