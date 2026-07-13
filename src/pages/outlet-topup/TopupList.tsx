/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/topup.config";
import { useNavigate } from "react-router-dom";
import { Button, Modal, useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";
import { useOutletTopup } from "@/services/outlet-topup/hooks";

export function TopupList() {
  useDocumentMeta("Topup Saldo | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { remove, removeResult } = useOutletTopup();
  const { isLoading: isRemoving, isSuccess: isRemoveSuccess } = removeResult;

  const handleDelete = useCallback(
    (row: any) => {
      openModal({
        id: "delete-topup",
        content: (
          <Modal.Wrapper
            open
            onClose={() => closeModal("delete-topup")}
            closeOnOutsideClick={false}
          >
            <Modal.Header>
              <div className="font-bold text-lg text-slate-900 leading-7">
                Hapus Topup
              </div>
            </Modal.Header>
            <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
              <p>Apakah Anda yakin ingin menghapus topup ini?</p>
            </Modal.Body>
            <Modal.Footer className="flex gap-2">
              <Button
                className="flex-1 rounded-xl"
                variant="error"
                onClick={() => remove({ id: row.id })}
                isLoading={isRemoving}
              >
                Hapus
              </Button>
              <Button
                className="flex-1 rounded-xl"
                styleType="outline"
                variant="secondary"
                onClick={() => closeModal("delete-topup")}
                disabled={isRemoving}
              >
                Batal
              </Button>
            </Modal.Footer>
          </Modal.Wrapper>
        ),
      });
    },
    [openModal, closeModal, remove, isRemoving],
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({ onRemove: handleDelete });
  }, [handleDelete]);

  const Table = useTable("outlet-topup", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    if (isRemoveSuccess) {
      closeModal("delete-topup");
      showToast({
        message: "Topup berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [isRemoveSuccess]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Finance"
        title="Topup Saldo Outlet"
        subtitle="Kelola permintaan topup saldo outlet."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/outlet-topup/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Topup
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada permintaan topup."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
