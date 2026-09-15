import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "@/lib/db-health";

export interface ShippingCalculationInput {
  subtotal: number;
  city: string;
  shippingMethodId?: string;
}

export interface ShippingCalculationOutput {
  methodId: string;
  nameAr: string;
  cost: number;
  isFree: boolean;
  estimatedDelivery: string;
}

const DEFAULT_SHIPPING_METHODS = [
  {
    id: "standard-shipping",
    nameAr: "توصيل قياسي للمنزل",
    nameEn: "Standard Delivery",
    cost: 25,
    freeThreshold: 200,
    estimatedDelivery: "2 - 4 أيام عمل",
    regions: ["جميع المدن"],
    isActive: true,
  },
  {
    id: "express-shipping",
    nameAr: "شحن سريع فائق السرعة",
    nameEn: "Express Delivery",
    cost: 45,
    freeThreshold: null,
    estimatedDelivery: "خلال 24 ساعة",
    regions: ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"],
    isActive: true,
  },
];

export class ShippingService {
  static async getAvailableMethods(city?: string) {
    const isOnline = await isDatabaseAvailable();
    if (!isOnline) {
      return DEFAULT_SHIPPING_METHODS;
    }

    try {
      const methods = await prisma.shippingMethod.findMany({
        where: { isActive: true },
        orderBy: { cost: "asc" },
      });

      if (methods.length === 0) {
        return DEFAULT_SHIPPING_METHODS;
      }

      return methods.map((m) => ({
        id: m.id,
        nameAr: m.nameAr,
        nameEn: m.nameEn,
        cost: Number(m.cost),
        freeThreshold: m.freeThreshold ? Number(m.freeThreshold) : null,
        estimatedDelivery: m.estimatedDelivery,
        regions: m.regions,
        isActive: m.isActive,
      }));
    } catch {
      return DEFAULT_SHIPPING_METHODS;
    }
  }

  static async calculateShipping(input: ShippingCalculationInput): Promise<ShippingCalculationOutput> {
    const methods = await this.getAvailableMethods(input.city);
    const selected =
      methods.find((m) => m.id === input.shippingMethodId) || methods[0];

    const isFree = Boolean(
      selected.freeThreshold && input.subtotal >= selected.freeThreshold
    );

    return {
      methodId: selected.id,
      nameAr: selected.nameAr,
      cost: isFree ? 0 : selected.cost,
      isFree,
      estimatedDelivery: selected.estimatedDelivery,
    };
  }
}
