import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { MailService } from "@/services/mail/mail.service";
import { isDatabaseAvailable } from "@/lib/db-health";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validated.data;
    const isOnline = await isDatabaseAvailable();

    if (!isOnline) {
      // Instant local registration
      const newUserId = `cust-${Date.now()}`;
      await setSessionCookie({
        id: newUserId,
        name,
        email,
        phone,
        role: "CUSTOMER",
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUserId,
          name,
          email,
          role: "CUSTOMER",
        },
      });
    }

    // Check if email or phone already in use
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existing.email === email
              ? "البريد الإلكتروني مسجل مسبقاً"
              : "رقم الهاتف مسجل مسبقاً",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    // Set HTTP-Only Session Cookie
    await setSessionCookie({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    // Send Welcome Email in background
    MailService.sendWelcomeEmail(user.email, user.name).catch(console.error);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
