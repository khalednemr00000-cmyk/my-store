"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ user }: { user?: any }) {
  const router = useRouter();
  const { toggleCart, getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted ? getTotalCount() : 0;
  const totalWishlistCount = mounted ? wishlistItems.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all dark:bg-slate-900/95 dark:border-slate-800">
      {/* Top Banner */}
      <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4 text-center font-medium">
        <div className="container mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">🚀 شحن مجاني للطلبات أكثر من 200 ر.س</span>
          <span className="mx-auto sm:mx-0">
            خصم إضافي 10% باستخدام كود: <span className="font-bold text-amber-400">ELITE10</span>
          </span>
          <span className="hidden sm:inline">ضمان استرجاع لمدة 14 يومًا</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
                س
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight dark:text-white leading-none">
                  سوق النخبة
                </span>
                <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest mt-1">
                  SOUQ ELITE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="hover:text-brand-600 transition-colors">
              جميع المنتجات
            </Link>
            <Link href="/categories/electronics" className="hover:text-brand-600 transition-colors">
              الإلكترونيات
            </Link>
            <Link href="/categories/fashion" className="hover:text-brand-600 transition-colors">
              الأزياء والموضة
            </Link>
            <Link href="/categories/perfumes" className="hover:text-brand-600 transition-colors">
              العطور الفاخرة
            </Link>
            <Link
              href="/products?offers=true"
              className="hover:text-brand-600 transition-colors flex items-center gap-1 text-amber-600 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              العروض الحصرية
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج، ماركة، أو فئة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-slate-100/80 border border-transparent rounded-full py-2.5 pr-11 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-600"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action Icons (Wishlist, User, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-full transition dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth */}
            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    {user.name?.charAt(0) || "م"}
                  </div>
                  <span className="hidden xl:inline text-xs font-semibold max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <div className="absolute left-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50 dark:bg-slate-900 dark:border-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {(user.role === "SUPER_ADMIN" ||
                    user.role === "ADMIN" ||
                    user.role === "MANAGER") && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      لوحة تحكم الإدارة
                    </Link>
                  )}
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Package className="w-4 h-4" />
                    طلباتي
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <User className="w-4 h-4" />
                    إعدادات الحساب
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-right dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <User className="w-4 h-4" />
                  تسجيل الدخول
                </Button>
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => toggleCart(true)}
              className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition shadow-sm shadow-brand-600/20 active:scale-95"
              aria-label="فتح السلة"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">السلة</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-brand-700 text-xs font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="ابحث في المتجر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-transparent rounded-full py-2 pr-10 pl-4 text-xs focus:bg-white focus:border-brand-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-28 bg-white border-b border-slate-200 shadow-xl p-6 space-y-4 z-50 dark:bg-slate-900 dark:border-slate-800">
          <nav className="flex flex-col space-y-3 font-medium text-slate-800 dark:text-slate-100">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              جميع المنتجات
            </Link>
            <Link
              href="/categories/electronics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              الإلكترونيات
            </Link>
            <Link
              href="/categories/fashion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              الأزياء والموضة
            </Link>
            <Link
              href="/categories/perfumes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              العطور
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between"
            >
              <span>المفضلة</span>
              <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                {totalWishlistCount}
              </span>
            </Link>
            {!user && (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-brand-50 text-brand-700 font-bold rounded-lg text-center"
              >
                تسجيل الدخول / إنشاء حساب
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
