/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Banknote, ArrowUpCircle, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { useReport } from "@/services/report/hooks";
import createTableConfig from "../table/product-sales.config";
import TableFilter from "../table/product-sales.filter";
import type { ReportSectionProps } from "./types";

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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
      <SummaryCard
        label='Total Qty'
        value={data.total_qty}
        icon={Banknote}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Discount'
        value={currencyFormat(data.total_discount)}
        icon={ArrowUpCircle}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Nett'
        value={currencyFormat(data.total_nett)}
        icon={Landmark}
        theme={THEMES.red}
      />
    </div>
  );
};

export function ProductSalesSection({
  tableName,
  filter,
  lockedFilter,
  showFilter = true,
  showSummary = true,
  onRowClick,
}: ReportSectionProps) {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter,
        lockedFilter,
        onRowClick:
          onRowClick ?? ((row) => navigate(`/sales/order/${row.order_id}`)),
      }),
    [filter, lockedFilter, onRowClick, navigate],
  );

  const Table = useTable(tableName, tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(
    () => ({
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    }),
    [Table.State?.lockedFilter, Table.State?.filter, Table.State?.textSearch],
  );

  const currentFilterString = JSON.stringify(currentFilter);
  const { productSalesSummary, productSalesSummaryResult } = useReport();

  useEffect(() => {
    if (Table.State) productSalesSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = productSalesSummaryResult.data?.data;

  return (
    <>
      {showSummary && <OverviewCards data={summary} />}
      <Table.Tools downloadable>
        {showFilter && <TableFilter table={Table} />}
      </Table.Tools>
      <Table.Render
        emptyTitle='No Product Sales Data'
        emptyDescription='Product Sales data will appear here once available.'
      />
      <Table.Pagination />
    </>
  );
}
