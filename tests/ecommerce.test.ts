import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  calculateDiscountPercentage,
  generateOrderNumber,
  formatPrice,
} from "../src/lib/utils.ts";

test("1. Utility & Pricing Calculations", async (t) => {
  await t.test("calculateDiscountPercentage calculates correct integer percent", () => {
    assert.equal(calculateDiscountPercentage(80, 100), 20);
    assert.equal(calculateDiscountPercentage(150, 200), 25);
    assert.equal(calculateDiscountPercentage(100, 100), 0);
    assert.equal(calculateDiscountPercentage(120, 100), 0);
  });

  await t.test("generateOrderNumber creates valid pattern", () => {
    const orderNum = generateOrderNumber();
    assert.match(orderNum, /^SE-\d{4}-\d{6}$/);
  });

  await t.test("formatPrice returns currency string in Arabic locale", () => {
    const formatted = formatPrice(250, "SAR");
    assert.ok(formatted.includes("ر.س") || formatted.includes("SAR") || formatted.includes("250"));
  });
});

test("2. Authentication & Security Logic", async (t) => {
  const password = "SuperSecretPassword2026!";
  const jwtSecret = "test_jwt_secret_key_at_least_32_characters_long";

  let hash = "";

  await t.test("Password hashing with bcryptjs generates valid hash", async () => {
    hash = await bcrypt.hash(password, 10);
    assert.ok(hash.startsWith("$2a$") || hash.startsWith("$2b$"));
  });

  await t.test("Password verification succeeds for correct password", async () => {
    const isValid = await bcrypt.compare(password, hash);
    assert.equal(isValid, true);
  });

  await t.test("Password verification fails for wrong password", async () => {
    const isInvalid = await bcrypt.compare("WrongPassword!", hash);
    assert.equal(isInvalid, false);
  });

  await t.test("JWT token signing and payload extraction", () => {
    const user = { id: "user-123", email: "test@souq.com", role: "ADMIN" };
    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, jwtSecret) as any;

    assert.equal(decoded.id, "user-123");
    assert.equal(decoded.role, "ADMIN");
  });
});

test("3. Coupon & Discount Engine Logic", async (t) => {
  // Coupon simulation function mimicking CouponService logic
  function applyCouponRule(
    subtotal: number,
    coupon: {
      type: "PERCENTAGE" | "FIXED";
      value: number;
      minOrder?: number;
      maxDiscount?: number;
      isActive: boolean;
      isExpired: boolean;
    }
  ) {
    if (!coupon.isActive || coupon.isExpired) {
      return { valid: false, error: "كوبون غير صالح" };
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { valid: false, error: "الطلب أقل من الحد الأدنى" };
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    return { valid: true, discountAmount: discount };
  }

  await t.test("Percentage coupon calculates discount correctly", () => {
    const res = applyCouponRule(200, {
      type: "PERCENTAGE",
      value: 10,
      isActive: true,
      isExpired: false,
    });
    assert.equal(res.valid, true);
    assert.equal(res.discountAmount, 20);
  });

  await t.test("Percentage coupon respects maximum discount cap", () => {
    const res = applyCouponRule(1000, {
      type: "PERCENTAGE",
      value: 20, // 200 SAR
      maxDiscount: 50, // capped at 50
      isActive: true,
      isExpired: false,
    });
    assert.equal(res.valid, true);
    assert.equal(res.discountAmount, 50);
  });

  await t.test("Fixed amount coupon calculates discount correctly", () => {
    const res = applyCouponRule(300, {
      type: "FIXED",
      value: 50,
      minOrder: 200,
      isActive: true,
      isExpired: false,
    });
    assert.equal(res.valid, true);
    assert.equal(res.discountAmount, 50);
  });

  await t.test("Rejects coupon when below minimum order amount", () => {
    const res = applyCouponRule(100, {
      type: "FIXED",
      value: 50,
      minOrder: 200,
      isActive: true,
      isExpired: false,
    });
    assert.equal(res.valid, false);
  });
});

test("4. Role-Based Access Control (RBAC) Logic", async (t) => {
  const allowedAdminRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

  function hasAccess(role: string, allowed: string[]) {
    return allowed.includes(role);
  }

  await t.test("SUPER_ADMIN has admin access", () => {
    assert.equal(hasAccess("SUPER_ADMIN", allowedAdminRoles), true);
  });

  await t.test("ADMIN and MANAGER have admin access", () => {
    assert.equal(hasAccess("ADMIN", allowedAdminRoles), true);
    assert.equal(hasAccess("MANAGER", allowedAdminRoles), true);
  });

  await t.test("CUSTOMER is denied access to admin", () => {
    assert.equal(hasAccess("CUSTOMER", allowedAdminRoles), false);
  });
});
