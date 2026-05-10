import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/outstanding-bills.config";
import TableFilter from "./table/outstanding-bills.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function OutstandingBills() {
  useDocumentMeta("OutstandingBills | Sukabread Franchisee", "Manage your OutstandingBills efficiently within the Sukabread Franchisee portal.");
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable(
    "outstanding_bills",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Report" title="Outstanding Bills" subtitle="" />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Outstanding Bills"
          emptyDescription="Outstanding bills will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
