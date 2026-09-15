import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting realistic Arabic database seeding for Souq Elite...");

  // 1. Clean existing records in safe order
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.shippingMethod.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const superAdminPassword = await bcrypt.hash("AdminSecurePassword2026!", 10);
  const customerPassword = await bcrypt.hash("Customer123456!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "مدير النظام العام",
      email: "admin@souqelite.com",
      phone: "+966500000001",
      passwordHash: superAdminPassword,
      role: "SUPER_ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "أحمد محمد الدوسري",
      email: "ahmed@example.com",
      phone: "+966551234567",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "سارة عبدالله القحطاني",
      email: "sara@example.com",
      phone: "+966559876543",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("✓ Created Admin and Customers");

  // 3. Create Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      recipientName: "أحمد الدوسري",
      phone: "+966551234567",
      city: "الرياض",
      region: "حي النرجس",
      street: "طريق أبي بكر الصديق",
      building: "فيلا 45",
      isDefault: true,
    },
  });

  // 4. Create Shipping Methods
  const standardShipping = await prisma.shippingMethod.create({
    data: {
      nameAr: "توصيل قياسي للمنزل (أرامكس / سمسا)",
      nameEn: "Standard Home Delivery",
      cost: 25,
      freeThreshold: 200,
      estimatedDelivery: "2 - 4 أيام عمل",
      regions: ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "كافة المدن"],
      isActive: true,
    },
  });

  const expressShipping = await prisma.shippingMethod.create({
    data: {
      nameAr: "شحن سريع فائق السرعة (خلال 24 ساعة)",
      nameEn: "Express Delivery",
      cost: 45,
      freeThreshold: 500,
      estimatedDelivery: "خلال 24 ساعة فقط",
      regions: ["الرياض", "جدة", "الدمام"],
      isActive: true,
    },
  });

  console.log("✓ Created Shipping Methods");

  // 5. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "ELITE10",
        description: "خصم 10% بمناسبة الافتتاح",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 150,
        maxDiscount: 100,
        usageLimit: 500,
        endDate: new Date("2026-12-31"),
        isActive: true,
      },
      {
        code: "WELCOME50",
        description: "خصم 50 ر.س فوري للأعضاء الجدد",
        discountType: "FIXED",
        discountValue: 50,
        minOrderAmount: 300,
        usageLimit: 200,
        endDate: new Date("2026-12-31"),
        isActive: true,
      },
    ],
  });

  console.log("✓ Created Coupons");

  // 6. Create Categories
  const catElectronics = await prisma.category.create({
    data: {
      nameAr: "الإلكترونيات والتقنية",
      nameEn: "Electronics & Tech",
      slug: "electronics",
      description: "أحدث الهواتف الذكية، السماعات العازلة للضوضاء، والساعات والأجهزة اللوحية الأصلية.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      sortOrder: 1,
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      nameAr: "الأزياء والأناقة",
      nameEn: "Fashion & Style",
      slug: "fashion",
      description: "تشكيلات راقية من الملابس، الحقائب الجلدية، والنظارات الشمسية من دور الأزياء العالمية.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      sortOrder: 2,
    },
  });

  const catPerfumes = await prisma.category.create({
    data: {
      nameAr: "العطور الفاخرة",
      nameEn: "Luxury Perfumes",
      slug: "perfumes",
      description: "أندر العطور الشرقية المفعمة بالعود والعنبر والمسك، بجانب أحدث الإصدارات الفرنسية.",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
      sortOrder: 3,
    },
  });

  const catWatches = await prisma.category.create({
    data: {
      nameAr: "الساعات الفخمة",
      nameEn: "Luxury Watches",
      slug: "watches",
      description: "ساعات كلاسيكية وأوتوماتيكية سويسرية تعبر عن الذوق الرفيع والحرفية العالية.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      sortOrder: 4,
    },
  });

  console.log("✓ Created Categories");

  // 7. Create Products
  const prod1 = await prisma.product.create({
    data: {
      nameAr: "سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء",
      nameEn: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      slug: "sony-wh-1000xm5",
      descriptionAr:
        "تعد سماعات سوني WH-1000XM5 قمة الابتكار في إلغاء الضوضاء النشط. تأتي مع معالجين متقدمين ومكبر صوت مصمم بدقة لتوفير صوت نقي لا مثيل له، مع بطارية تدوم حتى 30 ساعة وشحن سريع يوفر 3 ساعات عمل خلال 3 دقائق فقط.",
      price: 1399,
      compareAtPrice: 1599,
      sku: "SE-AUD-001",
      stock: 35,
      categoryId: catElectronics.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      ratingAverage: 4.9,
      reviewsCount: 38,
      specifications: [
        { key: "عمر البطارية", value: "30 ساعة متواصلة" },
        { key: "نوع الاتصال", value: "بلوتوث 5.2 لاسلكي" },
        { key: "الضمان", value: "سنتان لدى الوكيل المعتمد" },
        { key: "تقنية عزل الصوت", value: "إلغاء الضوضاء النشط الذكي ANC" },
      ],
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            altText: "سماعات سوني WH-1000XM5",
            sortOrder: 0,
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
            altText: "سماعات سوني منظر جانبي",
            sortOrder: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "SE-AUD-001-BLK",
            nameAr: "أسود كربوني",
            price: 1399,
            stock: 20,
            attributes: { color: "أسود" },
          },
          {
            sku: "SE-AUD-001-SLV",
            nameAr: "فضي بلاتينيوم",
            price: 1399,
            stock: 15,
            attributes: { color: "فضي" },
          },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      nameAr: "عطر ليذر نوار الملكي الفاخر - 100 مل",
      nameEn: "Leather Noir Royal Parfum - 100ml",
      slug: "leather-noir-royal-perfume",
      descriptionAr:
        "مزيج ساحر يجمع بين فخامة الجلود الطبيعية ودفء العنبر والعود الملكي مع لمسات من الهيل والتوت البري. يمنحك حضوراً آسراً يدوم لأكثر من 24 ساعة بثبات وفوحان استثنائيين.",
      price: 480,
      compareAtPrice: 620,
      sku: "SE-PRF-002",
      stock: 25,
      categoryId: catPerfumes.id,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      ratingAverage: 5.0,
      reviewsCount: 47,
      specifications: [
        { key: "الحجم", value: "100 مل" },
        { key: "التركيز", value: "Eau de Parfum مركز" },
        { key: "العائلة العطرية", value: "جلود - شرقي - أخشاب" },
        { key: "بلد الصنع", value: "فرنسا" },
      ],
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
            altText: "عطر ليذر نوار الفاخر",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      nameAr: "ساعة كرونوغراف أوتوماتيكية بسوار من الجلد الطبيعي",
      nameEn: "Classic Chronograph Automatic Watch",
      slug: "classic-chronograph-watch",
      descriptionAr:
        "تحفة فنية تجمع بين الأناقة الكلاسيكية والهندسة الدقيقة. زجاج من الياقوت المقاوم للخدش، وحركة ميكانيكية أوتوماتيكية لا تحتاج إلى بطارية، ومقاومة للماء حتى عمق 50 متراً.",
      price: 950,
      compareAtPrice: 1250,
      sku: "SE-WAT-003",
      stock: 14,
      categoryId: catWatches.id,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      ratingAverage: 4.8,
      reviewsCount: 22,
      specifications: [
        { key: "قطر الهيكل", value: "42 ملم" },
        { key: "نوع الزجاج", value: "ياقوت كريستالي ضد الخدش" },
        { key: "السوار", value: "جلد طبيعي إيطالي أصلي" },
        { key: "مقاومة الماء", value: "5 ATM (50 متر)" },
      ],
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
            altText: "ساعة يد كلاسيكية",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      nameAr: "نظارة شمسية كلاسيكية مستقطبة بإطار تيتانيوم",
      nameEn: "Classic Polarized Titanium Sunglasses",
      slug: "polarized-titanium-sunglasses",
      descriptionAr:
        "توفر أقصى درجات الحماية من الأشعة فوق البنفسجية UV400 مع عدسات مستقطبة تمنع التوهج وتمنحك رؤية بالغة الوضوح. إطار خفيف الوزن ومقاوم للصدمات مصنوع من التيتانيوم المرن.",
      price: 340,
      compareAtPrice: 420,
      sku: "SE-FSH-004",
      stock: 45,
      categoryId: catFashion.id,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      ratingAverage: 4.7,
      reviewsCount: 18,
      specifications: [
        { key: "نوع العدسات", value: "Polarized مستقطبة UV400" },
        { key: "مادة الإطار", value: "تيتانيوم فائق الخفة" },
        { key: "الملحقات", value: "علبة جلدية فاخرة + قماش تنظيف" },
      ],
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
            altText: "نظارة شمسية تيتانيوم",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("✓ Created Products with Variants and Specifications");

  // 8. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: prod1.id,
        userId: customer1.id,
        rating: 5,
        comment: "أفضل سماعات عازلة للضوضاء جربتها بحياتي! مريحة جداً في الرحلات الطويلة والصوت خرافي.",
        isVerified: true,
        isApproved: true,
      },
      {
        productId: prod2.id,
        userId: customer2.id,
        rating: 5,
        comment: "عطر ملوكي فخم وفواح جداً، كل من شم ريحته سألني عنه! التغليف كان ممتاز والتوصيل سريع.",
        isVerified: true,
        isApproved: true,
      },
    ],
  });

  // 9. Create Sample Order
  const orderNumber = "SE-2026-1001";
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: customer1.id,
      addressId: address1.id,
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
      shippingMethodId: standardShipping.id,
      trackingNumber: "SA-99882233",
      shippingSnapshot: {
        recipientName: "أحمد الدوسري",
        phone: "+966551234567",
        city: "الرياض",
        region: "حي النرجس",
        street: "طريق أبي بكر الصديق",
        building: "فيلا 45",
      },
      items: {
        create: [
          {
            productId: prod1.id,
            nameAr: "سماعات سوني اللاسلكية WH-1000XM5 عازلة للضوضاء",
            sku: "SE-AUD-001",
            unitPrice: 1399,
            quantity: 1,
            total: 1399,
          },
        ],
      },
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      orderId: order.id,
      amount: 1399,
      provider: "CASH_ON_DELIVERY",
      providerTxId: "COD-SE-2026-1001",
      status: "PAID",
      rawResponse: { method: "COD", note: "تم تحصيل المبلغ عند الاستلام بنجاح" },
    },
  });

  console.log("✓ Created Initial Order & Payment Transaction");
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
