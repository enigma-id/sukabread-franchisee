import { Page } from "@/components/app/layout";
import EmptyState from "@/components/ui/table/empty-state";

export function Stock() {
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
