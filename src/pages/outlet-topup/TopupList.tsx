/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/topup.config";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Modal, useEnigmaUI } from "@/components";
import { Plus, Wallet2Icon } from "lucide-react";
import { useOutletTopup } from "@/services/outlet-topup/hooks";
import { currencyFormat, getStatusVariant } from "@/utils";
import type { ContractOutletTopup } from "@/services/types/outlet-topup";

function DetailModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { show, showResult } = useOutletTopup();
  const { data: detailData, isLoading } = showResult;
  const detail = detailData?.data as ContractOutletTopup | undefined;

  useEffect(() => {
    show({ id });
  }, [id]);

  return (
    <Modal.Wrapper
      open
      onClose={onClose}
      closeOnOutsideClick={false}
    >
      <Modal.Header>
        <div className="flex items-center gap-3">
          <Wallet2Icon size={20} className="text-primary" />
          <div>
            <div className="font-bold text-lg text-slate-900 leading-7">
              Detail Topup
            </div>
            {detail && (
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {detail.code}
              </p>
            )}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Kode
                </label>
                <p className="text-sm font-mono font-medium text-slate-800 mt-1">
                  {detail.code}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={getStatusVariant(detail.document_status) as any}
                    appearance="soft"
                  >
                    {detail.document_status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Outlet
                </label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {detail.outlet?.name ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Jumlah
                </label>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {currencyFormat(detail.amount)}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Metode Pembayaran
                </label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {detail.payment_method?.name ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Provider
                </label>
                <p className="text-sm font-medium text-slate-800 mt-1 capitalize">
                  {detail.payment_method?.provider ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Dibuat Oleh
                </label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {detail.created_by ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tanggal
                </label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {new Date(detail.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {detail.document_status === "rejected" && detail.rejected_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">
                  Alasan Ditolak
                </label>
                <p className="text-sm text-red-700 mt-1">{detail.rejected_reason}</p>
              </div>
            )}

            {detail.payment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h4 className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                  <Wallet2Icon size={14} />
                  Informasi Pembayaran
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
                      Status Pembayaran
                    </label>
                    <p className="text-sm font-medium text-slate-800 mt-0.5 capitalize">
                      {detail.payment.status}
                    </p>
                  </div>
                  {detail.payment.va_number && (
                    <div>
                      <label className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
                        VA Number
                      </label>
                      <p className="text-sm font-mono font-semibold text-slate-800 mt-0.5">
                        {detail.payment.va_number}
                      </p>
                    </div>
                  )}
                  {detail.payment.bank_name && (
                    <div>
                      <label className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
                        Bank
                      </label>
                      <p className="text-sm font-medium text-slate-800 mt-0.5 uppercase">
                        {detail.payment.bank_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-sm text-slate-500">
            Data tidak ditemukan.
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-xl w-full"
          styleType="outline"
          variant="secondary"
          onClick={onClose}
        >
          Tutup
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}

export function TopupList() {
  useDocumentMeta("Topup Saldo | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { remove, removeResult } = useOutletTopup();
  const { isLoading: isRemoving, isSuccess: isRemoveSuccess } = removeResult;

  const handleDetail = useCallback(
    (row: ContractOutletTopup) => {
      openModal({
        id: "detail-topup",
        content: (
          <DetailModal
            id={row.id}
            onClose={() => closeModal("detail-topup")}
          />
        ),
      });
    },
    [openModal, closeModal],
  );

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
    return createTableConfig({
      onRemove: handleDelete,
      onRowClick: handleDetail,
    });
  }, [handleDelete, handleDetail]);

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
