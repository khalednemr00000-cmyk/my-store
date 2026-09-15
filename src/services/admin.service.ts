import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "@/lib/db-health";
import { localStore } from "./local-store";

export class AdminService {
  static async getDashboardStats() {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getDashboardStats();
    }

    try {
      const [salesAggregate, ordCount, custCount, prodCount, lowStock, recOrders] =
        await Promise.all([
          prisma.order.aggregate({
            where: { paymentStatus: { in: ["PAID", "PENDING"] } },
            _sum: { totalAmount: true },
          }),
          prisma.order.count(),
          prisma.user.count({ where: { role: "CUSTOMER" } }),
          prisma.product.count(),
          prisma.product.findMany({
            where: { stock: { lte: 5 } },
            take: 5,
            select: { id: true, nameAr: true, stock: true, sku: true },
          }),
          prisma.order.findMany({
            take: 6,
            orderBy: { createdAt: "desc" },
            include: { items: true },
          }),
        ]);

      return {
        totalSales: salesAggregate._sum.totalAmount ? Number(salesAggregate._sum.totalAmount) : 0,
        ordersCount: ordCount,
        customersCount: custCount,
        productsCount: prodCount,
        lowStockProducts: lowStock,
        recentOrders: recOrders,
      };
    } catch {
      return localStore.getDashboardStats();
    }
  }

  static async getProducts() {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getProducts({ limit: 100 }).items;
    }

    try {
      return await prisma.product.findMany({
        include: {
          category: true,
          images: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getProducts({ limit: 100 }).items;
    }
  }

  static async getOrders() {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getOrders();
    }

    try {
      return await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      });
    } catch {
      return localStore.getOrders();
    }
  }

  static async getCustomers() {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getCustomers();
    }

    try {
      return await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        include: {
          _count: { select: { orders: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getCustomers();
    }
  }

  static async getCoupons() {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getCoupons();
    }

    try {
      return await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getCoupons();
    }
  }

  static async getOrderInvoice(id: string) {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return localStore.getOrderById(id);
    }

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
          shippingMethod: true,
        },
      });
      return order || localStore.getOrderById(id);
    } catch {
      return localStore.getOrderById(id);
    }
  }
}
