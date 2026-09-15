import { prisma } from "@/lib/prisma";
import { OrderCreationInput, OrderStatus, PaymentStatus } from "@/types";
import { generateOrderNumber } from "@/lib/utils";
import { CouponService } from "./coupon.service";
import { ShippingService } from "./shipping/shipping.service";
import { PaymentFactory } from "./payment/payment.factory";
import { MailService } from "./mail/mail.service";
import { localStore } from "./local-store";
import { isDatabaseAvailable } from "@/lib/db-health";

const checkDbConnection = isDatabaseAvailable;

export class OrderService {
  static async createOrder(input: OrderCreationInput, userId?: string) {
    if (!input.items || input.items.length === 0) {
      throw new Error("سلة الشراء فارغة");
    }

    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      // Create and persist in local store with 0ms delay
      const created = localStore.createOrder(input);
      return {
        order: created,
        redirectUrl: undefined,
      };
    }

    try {
      return await prisma.$transaction(async (tx) => {
        let subtotal = 0;
        const orderItemsData: any[] = [];

        // 1. Verify stock and calculate item prices
        for (const item of input.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: { variants: true },
          });

          if (!product || !product.isActive) {
            throw new Error(`المنتج غير متوفر أو تم تعطيله`);
          }

          let unitPrice = Number(product.price);
          let sku = product.sku;
          let nameAr = product.nameAr;

          if (item.variantId) {
            const variant = product.variants.find((v) => v.id === item.variantId);
            if (!variant) throw new Error(`المواصفة المحددة غير متوفرة`);
            if (variant.stock < item.quantity) {
              throw new Error(`الكمية المطلوبة غير متوفرة من المنتج: ${product.nameAr}`);
            }
            if (variant.price) unitPrice = Number(variant.price);
            sku = variant.sku;
            nameAr = `${product.nameAr} - ${variant.nameAr}`;

            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            if (product.stock < item.quantity) {
              throw new Error(`الكمية المطلوبة غير متوفرة من المنتج: ${product.nameAr}`);
            }
          }

          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });

          const itemTotal = unitPrice * item.quantity;
          subtotal += itemTotal;

          orderItemsData.push({
            productId: product.id,
            variantId: item.variantId || null,
            nameAr,
            sku,
            unitPrice,
            quantity: item.quantity,
            total: itemTotal,
          });
        }

        // 2. Validate & calculate coupon if provided
        let discountAmount = 0;
        let couponId: string | null = null;
        let couponCode: string | null = null;

        if (input.couponCode) {
          const couponRes = await CouponService.validateCoupon(input.couponCode, subtotal, userId);
          if (couponRes.valid && couponRes.discountAmount) {
            discountAmount = couponRes.discountAmount;
            couponCode = couponRes.code || null;
            const cp = await tx.coupon.findUnique({ where: { code: couponCode! } });
            if (cp) {
              couponId = cp.id;
              await tx.coupon.update({
                where: { id: cp.id },
                data: { usedCount: { increment: 1 } },
              });
            }
          }
        }

        // 3. Calculate shipping
        const shippingCalc = await ShippingService.calculateShipping({
          subtotal: subtotal - discountAmount,
          city: input.shippingAddress.city,
          shippingMethodId: input.shippingMethodId,
        });

        const shippingCost = shippingCalc.cost;
        const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);
        const orderNumber = generateOrderNumber();

        // 4. Create Order
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: userId || null,
            customerName: input.shippingAddress.recipientName,
            customerEmail:
              input.shippingAddress.phone ? `${input.shippingAddress.phone}@souqelite.com` : "customer@souqelite.com",
            customerPhone: input.shippingAddress.phone,
            status: "PENDING",
            paymentStatus: "PENDING",
            paymentMethod: input.paymentMethod,
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount,
            couponId,
            couponCode,
            shippingMethodId: shippingCalc.methodId,
            notes: input.notes,
            shippingSnapshot: input.shippingAddress as any,
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
          },
        });

        // 5. Initiate Payment
        const paymentAdapter = PaymentFactory.getAdapter(input.paymentMethod);
        const paymentInit = await paymentAdapter.initiatePayment({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
          customerEmail: order.customerEmail,
          customerName: order.customerName,
        });

        if (paymentInit.status !== "PENDING") {
          await tx.order.update({
            where: { id: order.id },
            data: { paymentStatus: paymentInit.status },
          });
        }

        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            amount: totalAmount,
            provider: input.paymentMethod,
            providerTxId: paymentInit.providerTxId,
            status: paymentInit.status,
            rawResponse: paymentInit.rawResponse || {},
          },
        });

        MailService.sendOrderConfirmationEmail(
          order.customerEmail,
          order.orderNumber,
          Number(order.totalAmount)
        ).catch(console.error);

        return {
          order,
          redirectUrl: paymentInit.redirectUrl,
        };
      });
    } catch {
      const created = localStore.createOrder(input);
      return {
        order: created,
        redirectUrl: undefined,
      };
    }
  }

  static async getOrderByNumber(orderNumber: string) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getOrderByNumber(orderNumber);
    }

    try {
      return await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
          payments: true,
          shippingMethod: true,
        },
      });
    } catch {
      return localStore.getOrderByNumber(orderNumber);
    }
  }

  static async getUserOrders(userId: string) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.getOrders();
    }

    try {
      return await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1 } },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return localStore.getOrders();
    }
  }

  static async getAllOrders(params: {
    status?: OrderStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      const all = localStore.getOrders();
      return {
        items: all,
        total: all.length,
        page: 1,
        totalPages: 1,
      };
    }

    try {
      const page = params.page || 1;
      const limit = params.limit || 15;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (params.status) where.status = params.status;
      if (params.search) {
        where.OR = [
          { orderNumber: { contains: params.search, mode: "insensitive" } },
          { customerName: { contains: params.search, mode: "insensitive" } },
          { customerPhone: { contains: params.search } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.order.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      const all = localStore.getOrders();
      return {
        items: all,
        total: all.length,
        page: 1,
        totalPages: 1,
      };
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.updateOrderStatus(orderId, status);
    }

    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(trackingNumber ? { trackingNumber } : {}),
        },
      });
    } catch {
      return localStore.updateOrderStatus(orderId, status);
    }
  }

  static async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
    const dbAvailable = await checkDbConnection();
    if (!dbAvailable) {
      return localStore.updatePaymentStatus(orderId, paymentStatus);
    }

    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus },
      });
    } catch {
      return localStore.updatePaymentStatus(orderId, paymentStatus);
    }
  }
}
