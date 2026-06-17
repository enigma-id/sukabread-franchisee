import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/stock.config";

export function Stock() {
  useDocumentMeta(
    "Manajemen Stok | Sukabread Franchisee",
    "Pantau tingkat ketersediaan stok inventaris Anda.",
  );

  const tableConfig = useMemo(() => {
    return createTableConfig();
  }, []);

  const Table = useTable("stock-list", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventaris"
        title="Manajemen Stok"
        subtitle="Pantau stok saat ini dan pastikan ketersediaan item di outlet Anda."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Stok Tidak Ditemukan"
          emptyDescription="Gunakan filter untuk mencari item stok spesifik."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
