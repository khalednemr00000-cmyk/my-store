"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";

export interface Variant {
  id: string;
  sku: string;
  nameAr: string;
  price?: number | any | null;
  stock: number;
  attributes: any;
}

export interface VariantPickerProps {
  variants: Variant[];
  selectedVariantId?: string | null;
  onSelectVariant: (variant: Variant) => void;
}

export function VariantPicker({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantPickerProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        المواصفات والخيارات المتاحة:
      </label>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariantId === v.id;
          const isOutOfStock = v.stock <= 0;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(v)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
                isSelected
                  ? "border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-500/20 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-500"
                  : isOutOfStock
                  ? "border-slate-200 bg-slate-50 text-slate-400 line-through cursor-not-allowed dark:border-slate-800 dark:bg-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              <span>{v.nameAr}</span>
              {v.price && (
                <span className="text-[11px] text-brand-600 font-bold dark:text-brand-400">
                  ({formatPrice(Number(v.price))})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
