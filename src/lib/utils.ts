import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number | string | { toNumber?: () => number } | null | undefined,
  currency: string = process.env.NEXT_PUBLIC_CURRENCY || "SAR"
): string {
  if (amount === null || amount === undefined) return "0 ر.س";

  let num: number;
  if (typeof amount === "number") {
    num = amount;
  } else if (typeof amount === "string") {
    num = parseFloat(amount);
  } else if (amount && typeof amount === "object" && typeof (amount as any).toNumber === "function") {
    num = (amount as any).toNumber();
  } else {
    num = Number(amount);
  }

  if (isNaN(num)) return "0 ر.س";

  const formatted = new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);

  return formatted;
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\u0621-\u064A\u0660-\u0669-]+/g, "") // Keep Arabic letters, English, digits, hyphens
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function calculateDiscountPercentage(price: number, compareAtPrice?: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SE-${year}-${randomDigits}`;
}
