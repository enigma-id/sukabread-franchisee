import { Page } from "@/components/app/layout";
import EmptyState from "@/components/ui/table/empty-state";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function Stock() {
  useDocumentMeta("Stock | Sukabread Franchisee", "Manage your Stock efficiently within the Sukabread Franchisee portal.");
  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Manajemen Stok"
        subtitle="Kelola stok gudang dan outlet."
      />
      <Page.Body>
        <div className="card-table">
          <EmptyState
            type="empty"
            title="Data Stok Kosong"
            description="Gunakan filter di atas untuk mencari data spesifik."
          />
        </div>
      </Page.Body>
    </Page>
  );
}
