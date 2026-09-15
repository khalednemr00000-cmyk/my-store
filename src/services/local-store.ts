export interface LocalCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
  children?: any[];
}

export interface LocalProduct {
  id: string;
  nameAr: string;
  nameEn?: string;
  slug: string;
  descriptionAr: string;
  descriptionEn?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  stock: number;
  lowStockAlert: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  viewsCount: number;
  ratingAverage: number;
  reviewsCount: number;
  categoryId: string;
  category?: { id: string; nameAr: string; slug: string };
  specifications: Array<{ key: string; value: string }>;
  images: Array<{ id: string; url: string; altText?: string; sortOrder: number; isPrimary: boolean }>;
  variants: Array<{
    id: string;
    sku: string;
    nameAr: string;
    price?: number | null;
    stock: number;
    attributes: Record<string, string>;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    createdAt: string;
    user: { name: string };
  }>;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Database Store for Instant Local Responses (0ms Latency)
class LocalStore {
  private categories: LocalCategory[] = [
    {
      id: "cat-electronics",
      nameAr: "الإلكترونيات والتقنية",
      nameEn: "Electronics & Tech",
      slug: "electronics",
      description: "أحدث الهواتف الذكية، السماعات العازلة للضوضاء، والساعات والأجهزة اللوحية الأصلية.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      sortOrder: 1,
      isActive: true,
      _count: { products: 4 },
    },
    {
      id: "cat-fashion",
      nameAr: "الأزياء والأناقة",
      nameEn: "Fashion & Style",
      slug: "fashion",
      description: "تشكيلات راقية من الملابس، الحقائب الجلدية، والنظارات الشمسية من دور الأزياء العالمية.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
      sortOrder: 2,
      isActive: true,
      _count: { products: 3 },
    },
    {
      id: "cat-perfumes",
      nameAr: "العطور الفاخرة",
      nameEn: "Luxury Perfumes",
      slug: "perfumes",
      description: "أندر العطور الشرقية المفعمة بالعود والعنبر والمسك، بجانب أحدث الإصدارات الفرنسية.",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80",
      sortOrder: 3,
      isActive: true,
      _count: { products: 3 },
    },
    {
      id: "cat-watches",
      nameAr: "الساعات الفخمة",
      nameEn: "Luxury Watches",
      slug: "watches",
      description: "ساعات كلاسيكية وأوتوماتيكية سويسرية تعبر عن الذوق الرفيع والحرفية العالية.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
      sortOrder: 4,
      isActive: true,
      _count: { products: 3 },
    },
  ];

  private products: LocalProduct[] = [
    {
      id: "prod-1",
      nameAr: "سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء",
      nameEn: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh-1000xm5",
      descriptionAr:
        "تعد سماعات سوني WH-1000XM5 قمة الابتكار في إلغاء الضوضاء النشط. تأتي مع معالجين متقدمين ومكبر صوت مصمم بدقة لتوفير صوت نقي لا مثيل له، مع بطارية تدوم حتى 30 ساعة وشحن سريع يوفر 3 ساعات عمل خلال 3 دقائق فقط.",
      price: 1399,
      compareAtPrice: 1599,
      sku: "SE-AUD-001",
      stock: 35,
      lowStockAlert: 5,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      viewsCount: 1420,
      ratingAverage: 4.9,
      reviewsCount: 38,
      categoryId: "cat-electronics",
      category: { id: "cat-electronics", nameAr: "الإلكترونيات والتقنية", slug: "electronics" },
      specifications: [
        { key: "عمر البطارية", value: "30 ساعة متواصلة" },
        { key: "نوع الاتصال", value: "بلوتوث 5.2 لاسلكي" },
        { key: "الضمان", value: "سنتان لدى الوكيل المعتمد" },
        { key: "تقنية عزل الصوت", value: "إلغاء الضوضاء النشط الذكي ANC" },
      ],
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          altText: "سماعات سوني WH-1000XM5",
          sortOrder: 0,
          isPrimary: true,
        },
        {
          id: "img-1-2",
          url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
          altText: "سماعات سوني منظر جانبي",
          sortOrder: 1,
          isPrimary: false,
        },
      ],
      variants: [
        {
          id: "var-1",
          sku: "SE-AUD-001-BLK",
          nameAr: "أسود كربوني",
          price: 1399,
          stock: 20,
          attributes: { color: "أسود" },
        },
        {
          id: "var-2",
          sku: "SE-AUD-001-SLV",
          nameAr: "فضي بلاتينيوم",
          price: 1399,
          stock: 15,
          attributes: { color: "فضي" },
        },
      ],
      reviews: [
        {
          id: "rev-1",
          rating: 5,
          comment: "أفضل سماعات عازلة للضوضاء جربتها بحياتي! مريحة جداً في الرحلات الطويلة والصوت خرافي.",
          isVerified: true,
          createdAt: "2026-03-01T10:00:00Z",
          user: { name: "أحمد الدوسري" },
        },
      ],
      createdAt: "2026-01-10T12:00:00Z",
      updatedAt: "2026-01-10T12:00:00Z",
    },
    {
      id: "prod-2",
      nameAr: "عطر ليذر نوار الملكي الفاخر - 100 مل",
      nameEn: "Leather Noir Royal Parfum - 100ml",
      slug: "leather-noir-royal-perfume",
      descriptionAr:
        "مزيج ساحر يجمع بين فخامة الجلود الطبيعية ودفء العنبر والعود الملكي مع لمسات من الهيل والتوت البري. يمنحك حضوراً آسراً يدوم لأكثر من 24 ساعة بثبات وفوحان استثنائيين.",
      price: 480,
      compareAtPrice: 620,
      sku: "SE-PRF-002",
      stock: 25,
      lowStockAlert: 5,
      isActive: true,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      viewsCount: 2150,
      ratingAverage: 5.0,
      reviewsCount: 47,
      categoryId: "cat-perfumes",
      category: { id: "cat-perfumes", nameAr: "العطور الفاخرة", slug: "perfumes" },
      specifications: [
        { key: "الحجم", value: "100 مل" },
        { key: "التركيز", value: "Eau de Parfum مركز" },
        { key: "العائلة العطرية", value: "جلود - شرقي - أخشاب" },
        { key: "بلد الصنع", value: "فرنسا" },
      ],
      images: [
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
          altText: "عطر ليذر نوار الفاخر",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      variants: [],
      reviews: [
        {
          id: "rev-2",
          rating: 5,
          comment: "عطر ملوكي فخم وفواح جداً، كل من شم ريحته سألني عنه! التغليف كان ممتاز والتوصيل سريع.",
          isVerified: true,
          createdAt: "2026-03-05T15:30:00Z",
          user: { name: "سارة القحطاني" },
        },
      ],
      createdAt: "2026-01-12T12:00:00Z",
      updatedAt: "2026-01-12T12:00:00Z",
    },
    {
      id: "prod-3",
      nameAr: "ساعة كرونوغراف أوتوماتيكية بسوار من الجلد الطبيعي",
      nameEn: "Classic Chronograph Automatic Watch",
      slug: "classic-chronograph-watch",
      descriptionAr:
        "تحفة فنية تجمع بين الأناقة الكلاسيكية والهندسة الدقيقة. زجاج من الياقوت المقاوم للخدش، وحركة ميكانيكية أوتوماتيكية لا تحتاج إلى بطارية، ومقاومة للماء حتى عمق 50 متراً.",
      price: 950,
      compareAtPrice: 1250,
      sku: "SE-WAT-003",
      stock: 14,
      lowStockAlert: 5,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      viewsCount: 890,
      ratingAverage: 4.8,
      reviewsCount: 22,
      categoryId: "cat-watches",
      category: { id: "cat-watches", nameAr: "الساعات الفخمة", slug: "watches" },
      specifications: [
        { key: "قطر الهيكل", value: "42 ملم" },
        { key: "نوع الزجاج", value: "ياقوت كريستالي ضد الخدش" },
        { key: "السوار", value: "جلد طبيعي إيطالي أصلي" },
        { key: "مقاومة الماء", value: "5 ATM (50 متر)" },
      ],
      images: [
        {
          id: "img-3",
          url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
          altText: "ساعة يد كلاسيكية",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      variants: [],
      reviews: [],
      createdAt: "2026-01-15T12:00:00Z",
      updatedAt: "2026-01-15T12:00:00Z",
    },
    {
      id: "prod-4",
      nameAr: "نظارة شمسية كلاسيكية مستقطبة بإطار تيتانيوم",
      nameEn: "Classic Polarized Titanium Sunglasses",
      slug: "polarized-titanium-sunglasses",
      descriptionAr:
        "توفر أقصى درجات الحماية من الأشعة فوق البنفسجية UV400 مع عدسات مستقطبة تمنع التوهج وتمنحك رؤية بالغة الوضوح. إطار خفيف الوزن ومقاوم للصدمات مصنوع من التيتانيوم المرن.",
      price: 340,
      compareAtPrice: 420,
      sku: "SE-FSH-004",
      stock: 45,
      lowStockAlert: 5,
      isActive: true,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      viewsCount: 1120,
      ratingAverage: 4.7,
      reviewsCount: 18,
      categoryId: "cat-fashion",
      category: { id: "cat-fashion", nameAr: "الأزياء والأناقة", slug: "fashion" },
      specifications: [
        { key: "نوع العدسات", value: "Polarized مستقطبة UV400" },
        { key: "مادة الإطار", value: "تيتانيوم فائق الخفة" },
        { key: "الملحقات", value: "علبة جلدية فاخرة + قماش تنظيف" },
      ],
      images: [
        {
          id: "img-4",
          url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
          altText: "نظارة شمسية تيتانيوم",
          sortOrder: 0,
          isPrimary: true,
        },
      ],
      variants: [],
      reviews: [],
      createdAt: "2026-01-18T12:00:00Z",
      updatedAt: "2026-01-18T12:00:00Z",
    },
  ];

  private orders: any[] = [
    {
      id: "ord-1001",
      orderNumber: "SE-2026-1001",
      customerName: "أحمد الدوسري",
      customerEmail: "ahmed@example.com",
      customerPhone: "+966551234567",
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "CASH_ON_DELIVERY",
      subtotal: 1399,
      discountAmount: 0,
      shippingCost: 0,
      totalAmount: 1399,
      shippingSnapshot: {
        recipientName: "أحمد الدوسري",
        phone: "+966551234567",
        city: "الرياض",
        region: "حي النرجس",
        street: "طريق أبي بكر الصديق",
        building: "فيلا 45",
      },
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          nameAr: "سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء",
          sku: "SE-AUD-001",
          unitPrice: 1399,
          quantity: 1,
          total: 1399,
          product: {
            images: [
              { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
            ],
          },
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  private coupons: Array<{
    id: string;
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    usedCount: number;
    endDate: string;
    isActive: boolean;
  }> = [
    {
      id: "cp-1",
      code: "ELITE10",
      description: "خصم 10% على كافة المشتريات",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 150,
      maxDiscount: 100,
      usageLimit: 500,
      usedCount: 14,
      endDate: "2026-12-31",
      isActive: true,
    },
    {
      id: "cp-2",
      code: "WELCOME50",
      description: "خصم 50 ر.س ترحيبي",
      discountType: "FIXED",
      discountValue: 50,
      minOrderAmount: 300,
      maxDiscount: null,
      usageLimit: 200,
      usedCount: 8,
      endDate: "2026-12-31",
      isActive: true,
    },
  ];

  // Getters
  getCategories() {
    return this.categories;
  }

  getCategoryBySlug(slug: string) {
    return this.categories.find((c) => c.slug === slug);
  }

  getFeaturedProducts(limit = 8) {
    return this.products.filter((p) => p.isFeatured && p.isActive).slice(0, limit);
  }

  getNewArrivals(limit = 8) {
    return this.products.filter((p) => p.isNewArrival && p.isActive).slice(0, limit);
  }

  getBestSellers(limit = 8) {
    return this.products.filter((p) => p.isBestSeller && p.isActive).slice(0, limit);
  }

  getProductBySlug(slug: string) {
    return this.products.find((p) => p.slug === slug);
  }

  getRelatedProducts(categoryId: string, currentId: string, limit = 4) {
    return this.products
      .filter((p) => p.categoryId === categoryId && p.id !== currentId && p.isActive)
      .slice(0, limit);
  }

  getProducts(params: {
    search?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    let result = [...this.products.filter((p) => p.isActive)];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (params.categorySlug) {
      result = result.filter((p) => p.category?.slug === params.categorySlug);
    }

    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (params.sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (params.sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (params.sortBy === "rating") result.sort((a, b) => b.ratingAverage - a.ratingAverage);
    else if (params.sortBy === "bestseller") result.sort((a, b) => b.viewsCount - a.viewsCount);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = params.page || 1;
    const limit = params.limit || 12;
    const total = result.length;
    const items = result.slice((page - 1) * limit, page * limit);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  // Mutations
  addProduct(data: any) {
    const newProd: LocalProduct = {
      id: `prod-${Date.now()}`,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      slug: data.slug,
      descriptionAr: data.descriptionAr,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      sku: data.sku,
      stock: data.stock,
      lowStockAlert: 5,
      isActive: true,
      isFeatured: Boolean(data.isFeatured),
      isNewArrival: Boolean(data.isNewArrival),
      isBestSeller: Boolean(data.isBestSeller),
      viewsCount: 0,
      ratingAverage: 5.0,
      reviewsCount: 0,
      categoryId: data.categoryId,
      category: this.categories.find((c) => c.id === data.categoryId),
      specifications: data.specifications || [],
      images: (data.images || []).map((url: string, idx: number) => ({
        id: `img-${Date.now()}-${idx}`,
        url,
        sortOrder: idx,
        isPrimary: idx === 0,
      })),
      variants: [],
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  createOrder(data: any) {
    const orderNumber = `SE-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.shippingAddress.recipientName,
      customerEmail: data.shippingAddress.email || "customer@souqelite.com",
      customerPhone: data.shippingAddress.phone,
      status: "PENDING",
      paymentStatus: data.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID",
      paymentMethod: data.paymentMethod,
      subtotal: data.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
      discountAmount: data.discountAmount || 0,
      shippingCost: data.shippingCost || 0,
      totalAmount: data.totalAmount,
      couponCode: data.couponCode,
      shippingSnapshot: data.shippingAddress,
      items: data.items.map((i: any) => ({
        id: `item-${Date.now()}-${i.productId}`,
        productId: i.productId,
        nameAr: i.nameAr,
        sku: i.sku || "SKU-PROD",
        unitPrice: i.price,
        quantity: i.quantity,
        total: i.price * i.quantity,
        product: {
          images: [{ url: i.image }],
        },
      })),
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrders() {
    return this.orders;
  }

  getOrderByNumber(orderNumber: string) {
    return this.orders.find((o) => o.orderNumber === orderNumber);
  }

  updateOrderStatus(orderId: string, status: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) order.status = status;
    return order;
  }

  updatePaymentStatus(orderId: string, paymentStatus: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) order.paymentStatus = paymentStatus;
    return order;
  }

  getCoupons() {
    return this.coupons;
  }

  validateCoupon(code: string, subtotal: number) {
    const cp = this.coupons.find((c) => c.code === code.toUpperCase() && c.isActive);
    if (!cp) return { valid: false, message: "كود الخصم غير صحيح" };
    if (cp.minOrderAmount && subtotal < cp.minOrderAmount) {
      return { valid: false, message: `الحد الأدنى للطلب هو ${cp.minOrderAmount} ر.س` };
    }
    let discount = 0;
    if (cp.discountType === "PERCENTAGE") {
      discount = (subtotal * cp.discountValue) / 100;
      if (cp.maxDiscount && discount > cp.maxDiscount) discount = cp.maxDiscount;
    } else {
      discount = Math.min(cp.discountValue, subtotal);
    }
    return {
      valid: true,
      code: cp.code,
      discountAmount: discount,
      message: "تم تفعيل كود الخصم بنجاح!",
    };
  }

  getOrderById(id: string) {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  getCustomers() {
    return [
      {
        id: "cust-1",
        name: "أحمد الدوسري",
        email: "ahmed@example.com",
        phone: "+966551234567",
        role: "CUSTOMER",
        createdAt: "2026-01-10T10:00:00Z",
        _count: { orders: 3, reviews: 2 },
      },
      {
        id: "cust-2",
        name: "سارة القحطاني",
        email: "sara@example.com",
        phone: "+966509876543",
        role: "CUSTOMER",
        createdAt: "2026-01-15T14:30:00Z",
        _count: { orders: 2, reviews: 1 },
      },
      {
        id: "cust-3",
        name: "خالد الشمري",
        email: "khaled@example.com",
        phone: "+966543219876",
        role: "CUSTOMER",
        createdAt: "2026-02-01T09:15:00Z",
        _count: { orders: 1, reviews: 0 },
      },
    ];
  }

  getDashboardStats() {
    const totalSales = this.orders.reduce((sum, o) => {
      if (o.paymentStatus === "PAID" || o.paymentStatus === "PENDING") {
        return sum + Number(o.totalAmount || 0);
      }
      return sum;
    }, 0);

    const lowStockProducts = this.products
      .filter((p) => p.stock <= p.lowStockAlert)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        nameAr: p.nameAr,
        stock: p.stock,
        sku: p.sku,
      }));

    return {
      totalSales,
      ordersCount: this.orders.length,
      customersCount: 3,
      productsCount: this.products.length,
      lowStockProducts,
      recentOrders: this.orders.slice(0, 6),
    };
  }

  createCoupon(data: any) {
    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      description: data.description || "",
      discountType: data.discountType || "PERCENTAGE",
      discountValue: Number(data.discountValue),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      usedCount: 0,
      endDate: data.endDate,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.coupons.unshift(newCoupon);
    return newCoupon;
  }

  addReview(productId: string, data: { rating: number; comment: string; userName?: string }) {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return null;

    const newRev = {
      id: `rev-${Date.now()}`,
      rating: data.rating,
      comment: data.comment,
      isVerified: true,
      createdAt: new Date().toISOString(),
      user: { name: data.userName || "عميل موثق" },
    };

    prod.reviews.unshift(newRev);
    const total = prod.reviews.reduce((s, r) => s + r.rating, 0);
    prod.ratingAverage = Math.round((total / prod.reviews.length) * 10) / 10;
    prod.reviewsCount = prod.reviews.length;
    return newRev;
  }
}

// Global Singleton
const globalForStore = globalThis as unknown as { localStore: LocalStore | undefined };
export const localStore = globalForStore.localStore ?? new LocalStore();
if (process.env.NODE_ENV !== "production") globalForStore.localStore = localStore;
