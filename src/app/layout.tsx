import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { getSessionUser } from "@/lib/auth";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "سوق النخبة | وجهتكم للتسوق الفاخر",
    template: "%s | سوق النخبة",
  },
  description:
    "سوق النخبة هو المتجر الإلكتروني الرائد في تقديم أرقى المنتجات الأصلية من الأجهزة الذكية، الأزياء، العطور، ومستلزمات المنزل مع شحن سريع وضمان شامل.",
  keywords: ["متجر إلكتروني", "تسوق أونلاين", "سوق النخبة", "عطور", "إلكترونيات", "أزياء", "السعودية"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "/",
    siteName: "سوق النخبة | Souq Elite",
    title: "سوق النخبة | متجرك الإلكتروني الفاخر",
    description: "أفضل الماركات الأصلية مع توصيل سريع لجميع مناطق المملكة والخليج العربي.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
