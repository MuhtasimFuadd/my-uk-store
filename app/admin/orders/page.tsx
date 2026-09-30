import { requireAdminPage } from "@/lib/require-admin-page";
import OrdersDashboard from "@/components/admin/OrdersDashboard";

export default async function AdminOrdersPage() {
  await requireAdminPage();
  return <OrdersDashboard />;
}
