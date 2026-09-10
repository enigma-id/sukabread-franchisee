/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { Plus } from "lucide-react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Page } from "@/components/app/layout";
import createTableConfig from "./table/user.config";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { Modal, useEnigmaUI } from "@/components";
import { UserFormDrawer } from "./UserFormDrawer";

export function UserList() {
  useDocumentMeta(
    "Manajemen User | Sukabread Franchisee",
    "Kelola pengguna dan hak akses.",
  );
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const {
    remove,
    removeResult,
    activate,
    activateResult,
    deactivate,
    deactivateResult,
  } = useUser();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openForm = (user: any = null) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const closeForm = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const { isLoading: isDeleting, isSuccess: isDeleteSuccess } = removeResult;
  const { isSuccess: isActivateSuccess } = activateResult;
  const { isSuccess: isDeactivateSuccess } = deactivateResult;

  const handleToggleActive = (v: any) => {
    if (v.is_active) {
      deactivate({ id: v.id as string });
    } else {
      activate({ id: v.id as string });
    }
  };

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onClick: (row: any) => openForm(row),
      onRemove: (row: any) => {
        openDelete(row);
      },
      onToggleActive: (row: any) => handleToggleActive(row),
    });
  }, []);

  const Table = useTable("users", tableConfig as TableConfig<unknown>);

  const handleDelete = (row: any) => {
    if (row?.id) {
      remove({ id: row.id });
    }
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      closeModal("delete-user");
      showToast({
        message: "User berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      Table.boot();
    }
  }, [removeResult]);

  useEffect(() => {
    if (isActivateSuccess) {
      Table.boot();
    }
  }, [activateResult]);

  useEffect(() => {
    if (isDeactivateSuccess) {
      Table.boot();
    }
  }, [deactivateResult]);

  const openDelete = (row: any) => {
    openModal({
      id: "delete-user",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("delete-user")}
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
              onClick={() => handleDelete(row)}
              isLoading={isDeleting}
            >
              Hapus
            </Button>
            <Button
              className="flex-1 rounded-xl"
              styleType="outline"
              variant="secondary"
              onClick={() => closeModal("delete-user")}
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
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Manajemen User"
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            onClick={() => openForm()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat User
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <Table.Tools />
        <Table.Render
          emptyTitle="No Users Found"
          emptyDescription="Get started by creating your first user."
        />
        <Table.Pagination />
      </Page.Body>

      <UserFormDrawer
        open={drawerOpen}
        onClose={closeForm}
        user={selectedUser}
        onSaved={() => Table.boot()}
      />
    </Page>
  );
}
