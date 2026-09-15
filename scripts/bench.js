async function benchmark() {
  const routes = [
    '/',
    '/products',
    '/products/sony-wh-1000xm5',
    '/admin',
    '/admin/orders',
    '/admin/products',
    '/admin/coupons',
    '/cart',
    '/checkout'
  ];

  console.log('=== Performance Latency Benchmarks ===');
  for (const route of routes) {
    const t0 = performance.now();
    const res = await fetch('http://localhost:3000' + route);
    const ms = performance.now() - t0;
    console.log(`[${res.status}] ${route.padEnd(30)} -> ${ms.toFixed(1)} ms`);
  }

  console.log('\n=== API Latency Benchmark ===');
  const t0 = performance.now();
  const apiRes = await fetch('http://localhost:3000/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'ELITE10', subtotal: 500 })
  });
  const apiMs = performance.now() - t0;
  const json = await apiRes.json();
  console.log(`[${apiRes.status}] POST /api/coupons/validate -> ${apiMs.toFixed(1)} ms (discount: ${json.discountAmount} SAR)`);
}

benchmark();
