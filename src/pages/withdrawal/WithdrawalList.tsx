/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/withdrawal.config";
import { useNavigate } from "react-router-dom";
import { Button, Modal, useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";
import { useWithdrawal } from "@/services/withdrawal/hooks";

export function WithdrawalList() {
  useDocumentMeta("Permintaan Penarikan | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { cancel, cancelResult } = useWithdrawal();
  const { isLoading: isCanceling, isSuccess: isCancelSuccess } = cancelResult;

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onCancel: (row) => {
        openCancel(row);
      },
    });
  }, []);

  const Table = useTable(
    "withdrawal-list",
    tableConfig as TableConfig<unknown>,
  );

  const hancleCancel = (row: any) => {
    if (row?.id) {
      cancel({ id: row.id });
    }
  };

  useEffect(() => {
    if (isCancelSuccess) {
      closeModal("cancel-withdrawal");
      showToast({
        message: "Withdrawal berhasil dibatalkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      cancelResult.reset?.();
      Table.boot();
    }
  }, [isCancelSuccess]);

  const openCancel = (row: any) => {
    openModal({
      id: "cancel-withdrawal",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("cancel-withdrawal")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Hapus User
            </div>
          </Modal.Header>
          <Modal.Body className="text-sm font-normal text-slate-600 leading-5">
            <p>
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex gap-2">
            <Button
              className="flex-1 rounded-xl"
              variant="error"
              onClick={() => hancleCancel(row)}
              isLoading={isCanceling}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("cancel-withdrawal")}
              disabled={isCanceling}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Finance"
        title="Permintaan Penarikan"
        subtitle="Kelola permintaan penarikan saldo outlet."
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => navigate("/withdrawal/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Penarikan
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="Data Tidak Ditemukan"
          emptyDescription="Belum ada permintaan penarikan."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
