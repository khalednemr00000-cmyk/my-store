interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class MailService {
  private static async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    const provider = process.env.EMAIL_PROVIDER || "mock";
    const from = process.env.EMAIL_FROM || "orders@souqelite.com";

    if (provider === "resend" && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("mock")) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          console.error("Failed to send email via Resend:", err);
          return { success: false, error: "فشل إرسال البريد" };
        }
        return { success: true };
      } catch (err: any) {
        console.error("Resend error:", err);
        return { success: false, error: err.message };
      }
    }

    // Development & Mock Logger
    console.log("------------------------------------------");
    console.log(`[EMAIL DISPATCH - MOCK] To: ${options.to}`);
    console.log(`[SUBJECT]: ${options.subject}`);
    console.log("------------------------------------------");
    return { success: true };
  }

  static async sendWelcomeEmail(to: string, name: string) {
    return this.send({
      to,
      subject: "مرحباً بك في سوق النخبة | Souq Elite",
      html: `
        <div dir="rtl" style="font-family: Cairo, Tahoma, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #15803d;">أهلاً بك، ${name}!</h2>
          <p>يسعدنا انضمامك إلى مجتمع متسوقي النخبة. استمتع بتجربة تسوق فريدة وعروض حصرية لأعضائنا الجدد.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="display:inline-block; background-color:#15803d; color:#fff; padding: 10px 20px; border-radius: 6px; text-decoration:none;">ابدأ التسوق الآن</a></p>
        </div>
      `,
    });
  }

  static async sendOrderConfirmationEmail(to: string, orderNumber: string, totalAmount: number) {
    return this.send({
      to,
      subject: `تأكيد طلبك رقم #${orderNumber} | سوق النخبة`,
      html: `
        <div dir="rtl" style="font-family: Cairo, Tahoma, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #15803d;">تم استلام طلبك بنجاح!</h2>
          <p>رقم طلبك هو: <strong>#${orderNumber}</strong></p>
          <p>إجمالي الفاتورة: <strong>${totalAmount} ر.س</strong></p>
          <p>فريقنا يعمل حالياً على تجهيز الشحنة، وسنقوم بإشعارك فور خروجها للشحن.</p>
        </div>
      `,
    });
  }

  static async sendOrderStatusUpdateEmail(to: string, orderNumber: string, statusText: string) {
    return this.send({
      to,
      subject: `تحديث حالة طلبك #${orderNumber} إلى (${statusText})`,
      html: `
        <div dir="rtl" style="font-family: Cairo, Tahoma, sans-serif; padding: 20px; color: #1e293b;">
          <h2>تحديث حالة الطلب #${orderNumber}</h2>
          <p>أصبح طلبك الآن في حالة: <strong style="color:#15803d;">${statusText}</strong></p>
          <p>يمكنك تتبع تفاصيل شحنتك دائماً عبر حسابك في المتجر.</p>
        </div>
      `,
    });
  }

  static async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    return this.send({
      to,
      subject: "إعادة تعيين كلمة المرور | سوق النخبة",
      html: `
        <div dir="rtl" style="font-family: Cairo, Tahoma, sans-serif; padding: 20px; color: #1e293b;">
          <h2>طلب إعادة تعيين كلمة المرور</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. يرجى الضغط على الرابط التالي:</p>
          <p><a href="${resetUrl}" style="display:inline-block; background-color:#15803d; color:#fff; padding: 10px 20px; border-radius: 6px; text-decoration:none;">إعادة تعيين كلمة المرور</a></p>
          <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        </div>
      `,
    });
  }
}
