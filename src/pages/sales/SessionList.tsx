import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import createTableConfig from "./table/session.config";
import TableFilter from "./table/session.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function SessionList() {
  useDocumentMeta(
    "Sesi Penjualan | Sukabread Franchisee",
    "Daftar sesi penjualan outlet.",
  );
  const navigate = useNavigate();

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (e) => {
        navigate(`/sales/session/${e?.id}`);
      },
    });
  }, [navigate]);

  const Table = useTable("sales_session", tableConfig as TableConfig<unknown>);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Sales" title="Daftar Session" subtitle="" />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Orders Found"
          emptyDescription="Get started by creating your first order using the button above."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
