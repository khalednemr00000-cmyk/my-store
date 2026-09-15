import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Truck,
  FileText,
  LogOut,
  ArrowRight,
  Store,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "لوحة التحكم الإدارية | سوق النخبة",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Role check: Only SUPER_ADMIN, ADMIN, or MANAGER allowed
  if (
    !user ||
    (user.role !== "SUPER_ADMIN" &&
      user.role !== "ADMIN" &&
      user.role !== "MANAGER")
  ) {
    redirect("/auth/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between border-l border-slate-800 p-4 select-none">
        <div className="space-y-6">
          {/* Admin Brand */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 pb-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                س
              </div>
              <div>
                <p className="text-sm font-black text-white">إدارة المتجر</p>
                <p className="text-[10px] text-brand-400">Souq Elite CMS</p>
              </div>
            </Link>
            <span className="text-[10px] bg-brand-900/60 text-brand-300 px-2 py-0.5 rounded-full font-bold">
              {user.role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-500" />
              <span>نظرة عامة وإحصائيات</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>إدارة المنتجات والمخزون</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>إدارة الطلبات والشحن</span>
            </Link>

            <Link
              href="/admin/coupons"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition"
            >
              <Tag className="w-4 h-4 text-rose-400" />
              <span>الكوبونات والعروض</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition"
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>العملاء والمستخدمين</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Store className="w-4 h-4" />
            <span>عرض المتجر المباشر</span>
          </Link>

          <div className="px-3 py-2 bg-slate-800/60 rounded-xl flex items-center justify-between">
            <div className="truncate">
              <p className="font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-slate-400 hover:text-rose-400 p-1"
                title="خروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              لوحة التحكم المركزية
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 dark:bg-brand-950 dark:text-brand-300"
            >
              <Store className="w-3.5 h-3.5" />
              <span>الواجهة العامة</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
