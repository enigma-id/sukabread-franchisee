import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/balance-log.config";

export function OutletBalanceLog() {
  useDocumentMeta("Log Saldo Outlet | Sukabread Franchisee", "");

  const tableConfig = useMemo(() => {
    return createTableConfig();
  }, []);

  const Table = useTable("outlet-balance-log", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Log Saldo Outlet"
        subtitle="Riwayat perubahan saldo outlet."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Log Tidak Ditemukan"
          emptyDescription="Belum ada riwayat perubahan saldo."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
