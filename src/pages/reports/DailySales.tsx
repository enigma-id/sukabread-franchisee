import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/daily-sales.config";
import TableFilter from "./table/report-filter";

export function DailySales() {
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable("daily_sales", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Report" title="Penjualan Harian" subtitle="" />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Sales Data"
          emptyDescription="Sales data will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
