import { notFound } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { formatPrice, formatDate } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const metadata = {
  title: "فاتورة ضريبية رسمية | سوق النخبة",
};

export interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  const order = await AdminService.getOrderInvoice(id);

  if (!order) {
    notFound();
  }

  const shippingSnap = order.shippingSnapshot as any;
  const subtotalNum = Number(order.subtotal);
  const discountNum = Number(order.discountAmount);
  const shippingNum = Number(order.shippingCost);
  const totalNum = Number(order.totalAmount);

  // VAT estimation (15% inclusive or calculated)
  const vatAmount = Math.round(((totalNum * 15) / 115) * 100) / 100;
  const totalExcludingVat = Math.round((totalNum - vatAmount) * 100) / 100;

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8 flex justify-center text-slate-900 print:bg-white print:p-0">
      <div className="bg-white max-w-3xl w-full p-8 sm:p-12 shadow-md rounded-2xl print:shadow-none print:rounded-none print:p-6 space-y-8">
        {/* Actions bar for screen viewing */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <p className="text-xs text-slate-500">معاينة الفاتورة الضريبية الرسمية</p>
          <PrintButton />
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-base flex items-center justify-center">
                س
              </div>
              <span className="text-xl font-black text-slate-900">سوق النخبة</span>
            </div>
            <p className="text-xs text-slate-500">شركة سوق النخبة للتجارة الإلكترونية</p>
            <p className="text-xs text-slate-500">الرقم الضريبي (VAT): 300987654300003</p>
            <p className="text-xs text-slate-500">السجل التجاري (CR): 1010897654</p>
          </div>

          <div className="text-right sm:text-left space-y-1">
            <h2 className="text-lg font-black text-slate-900 uppercase">فاتورة ضريبية</h2>
            <p className="text-xs font-mono font-bold text-emerald-700">
              #{order.orderNumber}
            </p>
            <p className="text-xs text-slate-500">تاريخ الإصدار: {formatDate(order.createdAt)}</p>
            <p className="text-xs text-slate-500">طريقة الدفع: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-700">بيانات العميل:</h4>
            <p className="font-bold text-slate-900">{order.customerName}</p>
            <p className="text-slate-500">هاتف: {order.customerPhone}</p>
            <p className="text-slate-500">بريد: {order.customerEmail}</p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-700">عنوان التوصيل:</h4>
            {shippingSnap ? (
              <>
                <p className="text-slate-900">
                  {shippingSnap.city} - {shippingSnap.region}
                </p>
                <p className="text-slate-500">
                  {shippingSnap.street} {shippingSnap.building ? `- مبنى ${shippingSnap.building}` : ""}
                </p>
              </>
            ) : (
              <p className="text-slate-500">العنوان المسجل بالطلب</p>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div>
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">المنتج والوصف</th>
                <th className="p-3">الباركود (SKU)</th>
                <th className="p-3 text-center">الكمية</th>
                <th className="p-3">سعر الوحدة</th>
                <th className="p-3">الإجمالي شامل الضريبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item: any, idx: number) => (
                <tr key={item.id}>
                  <td className="p-3 text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-800">{item.nameAr}</td>
                  <td className="p-3 font-mono text-slate-500">{item.sku}</td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3">{formatPrice(Number(item.unitPrice))}</td>
                  <td className="p-3 font-bold">{formatPrice(Number(item.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>المجموع الخاضع للضريبة:</span>
              <span>{formatPrice(totalExcludingVat)}</span>
            </div>
            {discountNum > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>الخصم المطبق:</span>
                <span>-{formatPrice(discountNum)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>تكلفة الشحن:</span>
              <span>{shippingNum === 0 ? "مجاناً" : formatPrice(shippingNum)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>{formatPrice(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-300 pt-2">
              <span>الإجمالي النهائي:</span>
              <span className="text-emerald-700">{formatPrice(totalNum)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="text-center text-[10px] text-slate-400 pt-8 border-t border-slate-200 space-y-1">
          <p>هذه الفاتورة مستخرجة إلكترونياً وتعتبر رسمية ومعتمدة وفق أنظمة هيئة الزكاة والضريبة والجمارك.</p>
          <p>شكراً لتعاملكم مع سوق النخبة | www.souqelite.com | 920000000</p>
        </div>
      </div>
    </div>
  );
}
