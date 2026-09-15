import { prisma } from "@/lib/prisma";
import { localStore } from "./local-store";
import { isDatabaseAvailable } from "@/lib/db-health";

export interface ProductFilterParams {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "bestseller";
  page?: number;
  limit?: number;
}

const checkDbConnection = isDatabaseAvailable;

export class ProductService {
  static async getFeaturedProducts(limit = 8) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getFeaturedProducts(limit);
    }

    try {
      return await prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getFeaturedProducts(limit);
    }
  }

  static async getNewArrivals(limit = 8) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getNewArrivals(limit);
    }

    try {
      return await prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getNewArrivals(limit);
    }
  }

  static async getBestSellers(limit = 8) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getBestSellers(limit);
    }

    try {
      return await prisma.product.findMany({
        where: { isActive: true, isBestSeller: true },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
        take: limit,
        orderBy: { viewsCount: "desc" },
      });
    } catch {
      return localStore.getBestSellers(limit);
    }
  }

  static async getProductBySlug(slug: string) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getProductBySlug(slug);
    }

    try {
      return await prisma.product.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          variants: true,
          reviews: {
            where: { isApproved: true },
            include: {
              user: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch {
      return localStore.getProductBySlug(slug);
    }
  }

  static async getRelatedProducts(categoryId: string, currentProductId: string, limit = 4) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getRelatedProducts(categoryId, currentProductId, limit);
    }

    try {
      return await prisma.product.findMany({
        where: {
          categoryId,
          id: { not: currentProductId },
          isActive: true,
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
        take: limit,
      });
    } catch {
      return localStore.getRelatedProducts(categoryId, currentProductId, limit);
    }
  }

  static async getProducts(params: ProductFilterParams) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getProducts({
        search: params.search,
        categorySlug: params.categorySlug,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        inStock: params.inStock,
        sortBy: params.sortBy,
        page: params.page,
        limit: params.limit,
      });
    }

    try {
      const page = params.page || 1;
      const limit = params.limit || 12;
      const skip = (page - 1) * limit;

      const where: any = { isActive: true };

      if (params.search) {
        where.OR = [
          { nameAr: { contains: params.search, mode: "insensitive" } },
          { descriptionAr: { contains: params.search, mode: "insensitive" } },
          { sku: { contains: params.search, mode: "insensitive" } },
        ];
      }

      if (params.categorySlug) {
        where.category = { slug: params.categorySlug };
      }

      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        where.price = {};
        if (params.minPrice !== undefined) where.price.gte = params.minPrice;
        if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
      }

      if (params.rating !== undefined) {
        where.ratingAverage = { gte: params.rating };
      }

      if (params.inStock) {
        where.stock = { gt: 0 };
      }

      let orderBy: any = { createdAt: "desc" };
      if (params.sortBy === "price_asc") orderBy = { price: "asc" };
      if (params.sortBy === "price_desc") orderBy = { price: "desc" };
      if (params.sortBy === "rating") orderBy = { ratingAverage: "desc" };
      if (params.sortBy === "bestseller") orderBy = { viewsCount: "desc" };

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      return localStore.getProducts({
        search: params.search,
        categorySlug: params.categorySlug,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        inStock: params.inStock,
        sortBy: params.sortBy,
        page: params.page,
        limit: params.limit,
      });
    }
  }

  static async getCategories() {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getCategories();
    }

    try {
      return await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: { select: { products: true } },
          children: true,
        },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return localStore.getCategories();
    }
  }

  static async getCategoryBySlug(slug: string) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getCategoryBySlug(slug);
    }

    try {
      return await prisma.category.findUnique({
        where: { slug },
        include: {
          children: true,
        },
      });
    } catch {
      return localStore.getCategoryBySlug(slug);
    }
  }
}
