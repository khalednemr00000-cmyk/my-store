import { ShippingService } from "@/services/shipping/shipping.service";
import { getSessionUser } from "@/lib/auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "إتمام الطلب والدفع | سوق النخبة",
  description: "أكمل عملية الشراء بخطوات سهلة وآمنة مع خيارات دفع متعددة.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const shippingMethods = await ShippingService.getAvailableMethods();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          إتمام الطلب والشحن
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          يرجى إدخال بيانات التوصيل واختيار طريقة الدفع المناسبة لك
        </p>
      </div>

      <CheckoutForm user={user} shippingMethods={shippingMethods} />
    </div>
  );
}
