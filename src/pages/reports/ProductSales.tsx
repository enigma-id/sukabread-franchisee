import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/product-sales.config";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function ProductSales() {
  useDocumentMeta(
    "Product Sales | Sukabread Franchisee",
    "Manage your Product Sales efficiently within the Sukabread Franchisee portal.",
  );
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable(
    "report_product_sales",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Report" title="Penjualan Harian" subtitle="" />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <Table.Tools downloadable />

        <Table.Render
          emptyTitle="No Product Sales Data"
          emptyDescription="Product Sales data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
