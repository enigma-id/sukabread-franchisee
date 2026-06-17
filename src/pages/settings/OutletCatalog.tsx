import { useMemo, useCallback, useState, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useCatalog } from "@/services/catalog/hooks";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/catalog.config";
import type { CatalogOutlet } from "@/services/types/catalog";
import { StockRangeModal } from "./modal/StockRangeModal";

export function OutletCatalog() {
  useDocumentMeta(
    "Catalog Management | Sukabread Franchisee",
    "Manage your outlet catalog settings and stock ranges.",
  );

  const { activate, activateResult, deactivate, deactivateResult } =
    useCatalog();
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;
  const [selectedItem, setSelectedItem] = useState<CatalogOutlet | null>(null);

  const handleToggle = useCallback(
    async (id: string, isActive: boolean) => {
      if (isActive) {
        await deactivate({ id });
      } else {
        await activate({ id });
      }
    },
    [activate, deactivate],
  );

  const handleEdit = useCallback((item: CatalogOutlet) => {
    setSelectedItem(item);
  }, []);

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onToggle: handleToggle,
      onEdit: handleEdit,
    });
  }, [handleToggle, handleEdit]);

  const Table = useTable("outlet-catalog", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    if (isActivateSuccess) {
      Table.boot();
    }
  }, [isActivateSuccess]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      Table.boot();
    }
  }, [isDeactivateSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Manajemen Katalog Outlet"
        subtitle="Kelola ketersediaan menu dan batasan stok untuk outlet Anda."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Katalog Tidak Ditemukan"
          emptyDescription="Gunakan filter untuk mencari item spesifik."
        />
        <Table.Pagination />
      </Page.Body>

      {selectedItem && (
        <StockRangeModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => Table.refetch()}
        />
      )}
    </Page>
  );
}
