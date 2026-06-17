import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/stock-log.config";

export function StockLog() {
  useDocumentMeta(
    "Log Pergerakan Stok | Sukabread Franchisee",
    "Riwayat mutasi dan pergerakan stok inventaris.",
  );

  const tableConfig = useMemo(() => {
    return createTableConfig();
  }, []);

  const Table = useTable("stock-log-list", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventaris"
        title="Log Pergerakan Stok"
        subtitle="Lihat riwayat masuk, keluar, dan penyesuaian stok secara mendetail."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Log Stok Tidak Ditemukan"
          emptyDescription="Belum ada riwayat pergerakan stok untuk kriteria yang dipilih."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
