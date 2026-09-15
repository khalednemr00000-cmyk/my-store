import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { isDatabaseAvailable } from "@/lib/db-health";
import { localStore } from "@/services/local-store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role === "CUSTOMER") {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 403 });
    }

    const body = await request.json();
    const {
      nameAr,
      nameEn,
      slug,
      descriptionAr,
      price,
      compareAtPrice,
      sku,
      stock,
      categoryId,
      isFeatured,
      isNewArrival,
      isBestSeller,
      images,
      specifications,
    } = body;

    if (!nameAr || !price || !sku || !categoryId) {
      return NextResponse.json(
        { success: false, error: "يرجى تعبئة الحقول الأساسية المطلوبة" },
        { status: 400 }
      );
    }

    const finalSlug = slug ? slugify(slug) : slugify(nameAr) + `-${Date.now().toString().slice(-4)}`;

    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      const product = localStore.addProduct({
        nameAr,
        nameEn,
        slug: finalSlug,
        descriptionAr,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        sku,
        stock: Number(stock || 0),
        categoryId,
        isFeatured,
        isNewArrival,
        isBestSeller,
        images,
        specifications,
      });
      return NextResponse.json({ success: true, product });
    }

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn,
        slug: finalSlug,
        descriptionAr: descriptionAr || "وصف المنتج الافتراضي الفاخر",
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        sku,
        stock: Number(stock || 0),
        categoryId,
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        isBestSeller: Boolean(isBestSeller),
        specifications: specifications || [],
        images: {
          create: (images || []).map((imgUrl: string, idx: number) => ({
            url: imgUrl,
            sortOrder: idx,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Admin create product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشلت عملية حفظ المنتج" },
      { status: 500 }
    );
  }
}
