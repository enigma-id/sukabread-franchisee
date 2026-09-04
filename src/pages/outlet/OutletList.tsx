/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, useEnigmaUI } from "@/components";
import { Plus } from "lucide-react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Page } from "@/components/app/layout";
import createTableConfig from "./table/outlet.config";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useFranchiseOutlet } from "@/services/franchiseOutlet/hooks";
import type { FranchiseOutlet } from "@/services/types/franchiseOutlet";

export function OutletList() {
  useDocumentMeta(
    "Manajemen Outlet | Sukabread Franchisee",
    "Kelola outlet milik franchise.",
  );
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const navigate = useNavigate();
  const { remove, removeResult } = useFranchiseOutlet();

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onDetail: (row) => navigate(`/setting/outlet/${row.id}`),
      onEdit: (row) => navigate(`/setting/outlet/${row.id}/update`),
      onRemove: (row) => openDelete(row),
    });
  }, []);

  const Table = useTable("franchise-outlets", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-outlet");
      showToast({
        message: "Outlet berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [isDeleteSuccess]);

  const handleDelete = (row: FranchiseOutlet) => {
    if (row?.id) {
      remove({ id: row.id });
    }
  };

  const openDelete = (row: FranchiseOutlet) => {
    openModal({
      id: "delete-outlet",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-outlet")}
          closeOnOutsideClick={false}
        >
          <Modal.Header>
            <div className='font-bold text-lg text-slate-900 leading-7'>
              Hapus Outlet
            </div>
          </Modal.Header>
          <Modal.Body className='text-sm font-normal text-slate-600 leading-5'>
            <p>
              Apakah Anda yakin ingin menghapus outlet{" "}
              <strong>{row?.name}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='error'
              onClick={() => handleDelete(row)}
              isLoading={isDeleting}
            >
              Hapus
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("delete-outlet")}
              disabled={isDeleting}
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
        category='Settings'
        title='Manajemen Outlet'
        subtitle='Kelola outlet milik franchise Anda.'
        action={
          <Button
            variant='primary'
            shape='wide'
            size='md'
            onClick={() => navigate("/setting/outlet/create")}
          >
            <Plus className='w-4 h-4 mr-2' />
            Buat Outlet
          </Button>
        }
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <Table.Tools />
        <Table.Render
          emptyTitle='Data Tidak Ditemukan'
          emptyDescription='Belum ada outlet.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
