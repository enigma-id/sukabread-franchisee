/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import createTableConfig from "./table/salesRequest.config";
import { useNavigate } from "react-router-dom";
import { Button, Modal, useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";
import { useSalesRequest } from "@/services/salesRequest/hooks";
import type { SalesRequest } from "@/services/types/salesRequest";

export function SalesRequestList() {
  useDocumentMeta("Sales Request | Sukabread Franchisee", "Kelola permintaan pembelian barang.");
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { cancel, cancelResult, publish, publishResult } = useSalesRequest();
  const {
    isLoading: isCanceling,
    isSuccess: isCancelSuccess,
  } = cancelResult;
  const {
    isLoading: isPublishing,
    isSuccess: isPublishSuccess,
  } = publishResult;

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onDetail: (row) => navigate(`/purchase/${row.id}`),
      onEdit: (row) => navigate(`/purchase/${row.id}/update`),
      onCancel: (row) => openCancel(row),
      onPublish: (row) => openPublish(row),
    });
  }, [navigate]);

  const Table = useTable(
    "sales-request-list",
    tableConfig as TableConfig<unknown>,
  );

  useEffect(() => {
    if (isCancelSuccess) {
      closeModal("cancel-sales-request");
      showToast({
        message: "Sales Request berhasil dibatalkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      cancelResult.reset?.();
      Table.boot();
    }
  }, [isCancelSuccess]);

  useEffect(() => {
    if (isPublishSuccess) {
      closeModal("publish-sales-request");
      showToast({
        message: "Sales Request berhasil di-publish",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      publishResult.reset?.();
      Table.boot();
    }
  }, [isPublishSuccess]);

  const openCancel = (row: SalesRequest) => {
    openModal({
      id: "cancel-sales-request",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("cancel-sales-request")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Batalkan Sales Request
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Apakah Anda yakin ingin membatalkan request{" "}
              <span className='font-mono font-semibold'>{row.code}</span>?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='error'
              onClick={() => cancel({ id: row.id })}
              isLoading={isCanceling}
            >
              Batalkan
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("cancel-sales-request")}
              disabled={isCanceling}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const openPublish = (row: SalesRequest) => {
    openModal({
      id: "publish-sales-request",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("publish-sales-request")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Publish Sales Request
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Request{" "}
              <span className='font-mono font-semibold'>{row.code}</span> akan
              dikirim ke franchisor. Lanjutkan?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='success'
              onClick={() => publish({ id: row.id })}
              isLoading={isPublishing}
            >
              Publish
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("publish-sales-request")}
              disabled={isPublishing}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Transaksi'
        title='Sales Request'
        subtitle='Kelola permintaan pembelian barang dari outlet.'
        action={
          <Button
            variant='primary'
            shape='wide'
            size='md'
            onClick={() => navigate("/purchase/create")}
          >
            <Plus className='w-4 h-4 mr-2' />
            Buat Request
          </Button>
        }
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools />
        <Table.Render
          emptyTitle='Data Tidak Ditemukan'
          emptyDescription='Belum ada sales request.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
