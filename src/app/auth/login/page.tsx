"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.error || "بيانات الدخول غير صحيحة");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl font-bold dark:bg-brand-950 dark:text-brand-400">
            س
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            تسجيل الدخول
          </h1>
          <p className="text-xs text-slate-500">
            أهلاً بك مجدداً! أدخل بياناتك للوصول إلى حسابك وطلباتك
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="كلمة المرور *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full gap-2 font-bold shadow-md shadow-brand-600/20"
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2 dark:border-slate-800">
          <p>
            ليس لديك حساب بعد؟{" "}
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-brand-600 font-bold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
          <div className="pt-2 text-[11px] text-slate-400 bg-slate-50 p-2 rounded-xl dark:bg-slate-800">
            <p className="font-semibold text-slate-600 dark:text-slate-300">بيانات دخول المشرف التجريبية:</p>
            <p>admin@souqelite.com | AdminSecurePassword2026!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-xs text-slate-400">
          جاري التحميل...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
