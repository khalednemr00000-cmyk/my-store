"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Shield, RefreshCw, Truck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Trust Badges Section */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-900/40 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">شحن سريع ومجاني</h5>
                <p className="text-xs text-slate-400">للطلبات الأكثر من 200 ر.س</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-900/40 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">دفع آمن 100%</h5>
                <p className="text-xs text-slate-400">بوابات دفع مشفرة ومحمية</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-900/40 text-brand-400 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">استرجاع سهل وميسر</h5>
                <p className="text-xs text-slate-400">خلال 14 يومًا من الاستلام</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-900/40 text-brand-400 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">دعم فني 24/7</h5>
                <p className="text-xs text-slate-400">خدمة عملاء جاهزة دائماً</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Store Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg">
                س
              </div>
              <span className="text-xl font-black text-white">سوق النمر</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              وجهتكم الأولى للتسوق الإلكتروني الراقي في المملكة العربية السعودية والشرق الأوسط.
              نقدم لكم تشكيلات منتقاة بعناية من أفضل العلامات التجارية العالمية مع ضمان أصالة 100%.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>الرقم الموحد: 920000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>support@souqelite.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>الرياض - طريق الملك فهد - المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">التصنيفات الرئيسية</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/categories/electronics" className="hover:text-brand-400 transition">
                  الإلكترونيات والتقنية
                </Link>
              </li>
              <li>
                <Link href="/categories/fashion" className="hover:text-brand-400 transition">
                  الأزياء الرجالية والنسائية
                </Link>
              </li>
              <li>
                <Link href="/categories/perfumes" className="hover:text-brand-400 transition">
                  العطور الشرقية والفرنسية
                </Link>
              </li>
              <li>
                <Link href="/categories/watches" className="hover:text-brand-400 transition">
                  الساعات الفاخرة
                </Link>
              </li>
              <li>
                <Link href="/categories/home" className="hover:text-brand-400 transition">
                  المنزل والديكور
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">خدمة العملاء</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/account/orders" className="hover:text-brand-400 transition">
                  تتبع طلبي
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-400 transition">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-brand-400 transition">
                  سياسة الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-brand-400 transition">
                  سياسة الاسترجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-400 transition">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">النشرة البريدية</h4>
            <p className="text-xs text-slate-400">
              اشترك الآن واحصل على كود خصم 10% على أول عملية شراء لك.
            </p>
            {subscribed ? (
              <p className="text-xs text-emerald-400 font-bold">
                شكراً لاشتراكك! تم إرسال كود الخصم لبريدك.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Button variant="primary" size="sm" className="w-full">
                  اشترك الآن
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} سوق النمر (Souq Elite) - مسجل تجارياً
          </p>
          <div className="flex items-center gap-3">
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-semibold">
              مدى MADA
            </span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-semibold">
              VISA
            </span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-semibold">
              MasterCard
            </span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-semibold">
              Apple Pay
            </span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-300 font-semibold">
              الدفع عند الاستلام
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
