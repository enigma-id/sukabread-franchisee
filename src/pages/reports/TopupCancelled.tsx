/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/topup-cancelled.config";
import TableFilter from "./table/topup-cancelled.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function TopupCancelled() {
  useDocumentMeta(
    "Report Topup Dibatalkan | Sukabread Franchisee",
    "Laporan topup saldo yang dibatalkan.",
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({}) as TableConfig<unknown>;
  }, []);

  const Table = useTable(
    "report_topup_cancelled",
    tableConfig,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Topup Dibatalkan"
        subtitle="Laporan topup saldo yang dibatalkan."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools downloadable>
          <TableFilter table={Table as any} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Tidak Ada Topup Dibatalkan"
          emptyDescription="Topup yang dibatalkan akan muncul di sini jika tersedia."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default TopupCancelled;
