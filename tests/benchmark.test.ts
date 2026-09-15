import test from "node:test";
import assert from "node:assert";
import { ProductService } from "../src/services/product.service";
import { OrderService } from "../src/services/order.service";
import { CouponService } from "../src/services/coupon.service";
import { ShippingService } from "../src/services/shipping/shipping.service";
import { AdminService } from "../src/services/admin.service";

test("Performance Benchmark: Query & Service Latencies", async (t) => {
  await t.test("ProductService.getFeaturedProducts returns under 20ms", async () => {
    const start = performance.now();
    const products = await ProductService.getFeaturedProducts(8);
    const elapsed = performance.now() - start;
    console.log(`[PERF] getFeaturedProducts: ${elapsed.toFixed(2)} ms, returned: ${products.length} products`);
    assert.ok(products.length > 0);
    assert.ok(elapsed < 20, `Elapsed ${elapsed}ms exceeded 20ms threshold`);
  });

  await t.test("ProductService.getProducts with filter & search under 20ms", async () => {
    const start = performance.now();
    const result = await ProductService.getProducts({ search: "سوني", limit: 10 });
    const elapsed = performance.now() - start;
    console.log(`[PERF] getProducts (search): ${elapsed.toFixed(2)} ms, returned: ${result.items.length} items`);
    assert.ok(result.items.length > 0);
    assert.ok(elapsed < 20, `Elapsed ${elapsed}ms exceeded 20ms threshold`);
  });

  await t.test("CouponService.validateCoupon returns under 10ms", async () => {
    const start = performance.now();
    const res = await CouponService.validateCoupon("ELITE10", 500);
    const elapsed = performance.now() - start;
    console.log(`[PERF] validateCoupon: ${elapsed.toFixed(2)} ms, discount: ${res.discountAmount}`);
    assert.strictEqual(res.valid, true);
    assert.ok(elapsed < 10, `Elapsed ${elapsed}ms exceeded 10ms threshold`);
  });

  await t.test("ShippingService.calculateShipping returns under 10ms", async () => {
    const start = performance.now();
    const res = await ShippingService.calculateShipping({ subtotal: 350, city: "الرياض" });
    const elapsed = performance.now() - start;
    console.log(`[PERF] calculateShipping: ${elapsed.toFixed(2)} ms, cost: ${res.cost}`);
    assert.strictEqual(res.isFree, true);
    assert.ok(elapsed < 10, `Elapsed ${elapsed}ms exceeded 10ms threshold`);
  });

  await t.test("AdminService.getDashboardStats returns under 15ms", async () => {
    const start = performance.now();
    const stats = await AdminService.getDashboardStats();
    const elapsed = performance.now() - start;
    console.log(`[PERF] AdminService.getDashboardStats: ${elapsed.toFixed(2)} ms, sales: ${stats.totalSales}`);
    assert.ok(stats.totalSales > 0);
    assert.ok(elapsed < 15, `Elapsed ${elapsed}ms exceeded 15ms threshold`);
  });

  await t.test("AdminService.getOrders returns under 10ms", async () => {
    const start = performance.now();
    const orders = await AdminService.getOrders();
    const elapsed = performance.now() - start;
    console.log(`[PERF] AdminService.getOrders: ${elapsed.toFixed(2)} ms, count: ${orders.length}`);
    assert.ok(orders.length > 0);
    assert.ok(elapsed < 10, `Elapsed ${elapsed}ms exceeded 10ms threshold`);
  });
});
