"use client";

import * as React from "react";
import { Star, ShieldCheck, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string | Date;
  user: {
    name: string;
  };
}

export interface ProductReviewsProps {
  productId: string;
  reviews: ReviewItem[];
  user?: any;
}

export function ProductReviews({ productId, reviews, user }: ProductReviewsProps) {
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [reviewList, setReviewList] = React.useState<ReviewItem[]>(reviews);
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("شكراً لك! تم إضافة تقييمك بنجاح.");
        setReviewList([
          {
            id: Date.now().toString(),
            rating,
            comment,
            isVerified: true,
            createdAt: new Date().toISOString(),
            user: { name: user?.name || "أنت" },
          },
          ...reviewList,
        ]);
        setComment("");
      } else {
        alert(data.error || "تعذر إضافة التقييم");
      }
    } catch {
      alert("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          تقييمات وآراء العملاء ({reviewList.length})
        </h3>
      </div>

      {/* Review Submission Form */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              أضف رأيك وتجربتك حول المنتج:
            </h4>

            {/* Star Selector */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 ml-2">تقييمك:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 transition ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب تعليقك هنا بكل صراحة لمساعدة المتسوقين الآخرين..."
                required
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            {successMessage && (
              <p className="text-xs text-emerald-600 font-bold">{successMessage}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              إرسال التقييم
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              يجب عليك تسجيل الدخول أولاً لتتمكن من إضافة تقييم لهذا المنتج.
            </p>
            <a
              href="/auth/login"
              className="inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              اضغط هنا لتسجيل الدخول
            </a>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
        {reviewList.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            لا توجد تقييمات لهذا المنتج حتى الآن، كن أول من يشاركنا رأيه!
          </p>
        ) : (
          reviewList.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {rev.user?.name || "عميل موثق"}
                      </span>
                      {rev.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium dark:bg-emerald-950 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" />
                          مشتري موثق
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(rev.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < rev.rating ? "fill-amber-400" : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed dark:text-slate-300 pr-10">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
