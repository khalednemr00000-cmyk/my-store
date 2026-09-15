import { AdminService } from "@/services/admin.service";
import { AdminOrdersTable } from "./orders-table";

export const metadata = {
  title: "إدارة الطلبات | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await AdminService.getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          إدارة ومعالجة الطلبات ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          تحديث حالات الشحن، متابعة المدفوعات، وطباعة الفواتير الضريبية
        </p>
      </div>

      <AdminOrdersTable initialOrders={orders} />
    </div>
  );
}
