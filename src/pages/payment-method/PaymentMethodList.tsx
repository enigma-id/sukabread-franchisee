import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/payment-method.config";

export function PaymentMethodList() {
  useDocumentMeta("Metode Pembayaran | Sukabread Franchisee", "");

  const tableConfig = useMemo(() => {
    return createTableConfig();
  }, []);

  const Table = useTable(
    "payment-method",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Metode Pembayaran"
        subtitle="Daftar metode pembayaran yang tersedia."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada metode pembayaran."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
