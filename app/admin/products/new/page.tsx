import { requireAdminPage } from "@/lib/require-admin-page";
import NewProductForm from "@/components/admin/NewProductForm";

export default async function NewProductPage() {
  await requireAdminPage();
  return <NewProductForm />;
}
