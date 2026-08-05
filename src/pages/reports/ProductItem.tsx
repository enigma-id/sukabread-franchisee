/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/product-item.config";
import TableFilter from "./table/product-item.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useReport } from "@/services/report/hooks";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, Landmark } from "lucide-react";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
      <SummaryCard
        label="Total Qty"
        value={data.total_qty}
        icon={Banknote}
        theme={THEMES.orange}
      />
      <SummaryCard
        label="Total Nett"
        value={currencyFormat(data.total_nett)}
        icon={Landmark}
        theme={THEMES.red}
      />
    </div>
  );
};

export function ProductItem() {
  useDocumentMeta(
    "Product Item | Sukabread Franchisee",
    "Laporan penjualan produk per item.",
  );
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable(
    "report_product_item",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const { productItemSummary, productItemSummaryResult } = useReport();

  useEffect(() => {
    if (Table.State) {
      productItemSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = productItemSummaryResult.data?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Penjualan Menu"
        subtitle=""
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Product Item Data"
          emptyDescription="Product item data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
