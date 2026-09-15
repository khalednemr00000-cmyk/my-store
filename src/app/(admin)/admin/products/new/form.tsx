"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export function AdminProductForm({ categories }: { categories: Array<{ id: string; nameAr: string }> }) {
  const router = useRouter();

  const [nameAr, setNameAr] = React.useState("");
  const [nameEn, setNameEn] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [descriptionAr, setDescriptionAr] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [compareAtPrice, setCompareAtPrice] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [stock, setStock] = React.useState("10");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isNewArrival, setIsNewArrival] = React.useState(true);
  const [isBestSeller, setIsBestSeller] = React.useState(false);
  const [specs, setSpecs] = React.useState<Array<{ key: string; value: string }>>([
    { key: "الضمان", value: "سنتان لدى الوكيل" },
  ]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr,
          nameEn,
          slug,
          descriptionAr,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          sku,
          stock: Number(stock),
          categoryId,
          isFeatured,
          isNewArrival,
          isBestSeller,
          images: images.length > 0 ? images : ["https://placehold.co/600x600/png?text=Product"],
          specifications: specs.filter((s) => s.key && s.value),
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(data.error || "تعذر حفظ المنتج");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Basic Info Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          المعلومات الأساسية للمنتج
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="اسم المنتج بالعربية *"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="ساعة ذكية فاخرة الإصدار 7"
            required
          />
          <Input
            label="الاسم بالإنجليزية (اختياري)"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Smart Luxury Watch Series 7"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              التصنيف الرئيسي *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="رمز الباركود SKU *"
            value={sku}
            onChange={(e) => setSku(e.target.value.toUpperCase())}
            placeholder="SE-WAT-001"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            وصف المنتج بالعربية *
          </label>
          <textarea
            rows={4}
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="اكتب وصفاً جذاباً وتفصيلياً لمزايا المنتج..."
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Pricing & Stock Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          الأسعار والمخزون
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="السعر الفعلي (ر.س) *"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="299"
            required
          />
          <Input
            label="السعر قبل الخصم (اختياري)"
            type="number"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            placeholder="399"
          />
          <Input
            label="الكمية المتوفرة بالمخزون *"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="20"
            required
          />
        </div>

        {/* Visibility badges */}
        <div className="flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>منتج مميز (يظهر في القسم المميز)</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>أحدث وصولاً</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>الأكثر مبيعاً</span>
          </label>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          صور المنتج (روابط مباشرة أو CDN)
        </h3>

        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
            إضافة الرابط
          </Button>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs dark:bg-slate-800 dark:border-slate-700"
              >
                <span className="truncate max-w-md font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {img}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-rose-600 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            المواصفات الفنية
          </h3>
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة خاصية
          </button>
        </div>

        <div className="space-y-3">
          {specs.map((spec, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center">
              <input
                type="text"
                placeholder="الخاصية (مثل: اللون)"
                value={spec.key}
                onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                className="col-span-2 rounded-xl border border-slate-200 p-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="القيمة (مثل: أسود ملكي)"
                value={spec.value}
                onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                className="col-span-2 rounded-xl border border-slate-200 p-2 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-600 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="font-bold px-8"
        >
          حفظ ونشر المنتج
        </Button>
      </div>
    </form>
  );
}
