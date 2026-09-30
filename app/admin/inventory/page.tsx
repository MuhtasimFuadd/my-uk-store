import { requireAdminPage } from "@/lib/require-admin-page";
import InventoryDashboard from "@/components/admin/InventoryDashboard";

export default async function InventoryPage() {
  await requireAdminPage();
  return <InventoryDashboard />;
}
