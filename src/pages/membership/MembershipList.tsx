/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/membership.config";
import { useNavigate } from "react-router-dom";

export function Membership() {
  const navigate = useNavigate();
  useDocumentMeta(
    "Manajemen Member | Sukabread Franchisee",
    "Kelola data anggota dan poin loyalitas pelanggan.",
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onView: (e) => navigate(`/membership/${e?.id}`),
    });
  }, []);

  const Table = useTable(
    "membership-list",
    tableConfig as TableConfig<unknown>,
  );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="CRM"
        title="Manajemen Membership"
        subtitle="Daftar pelanggan setia dan riwayat poin mereka."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Member Tidak Ditemukan"
          emptyDescription="Daftar member masih kosong atau tidak sesuai filter."
        />
        <Table.Pagination />
      </Page.Body>

      {/* Detail Modal could be added here similar to OutletCatalog */}
    </Page>
  );
}
