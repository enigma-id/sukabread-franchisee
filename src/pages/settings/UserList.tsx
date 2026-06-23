import { useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { Plus } from "lucide-react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { Page } from "@/components/app/layout";
import createTableConfig from "./table/user.config";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function UserList() {
  useDocumentMeta(
    "User List | Sukabread Franchisee",
    "Manage your UserList efficiently within the Sukabread Franchisee portal.",
  );
  const navigate = useNavigate();
  const { activate, activeResult, deactivate, deactiveResult } = useUser();

  const handleToggle = useCallback(
    async (userId: number, isActive: boolean) => {
      if (isActive) {
        await deactivate({ id: userId });
      } else {
        await activate({ id: userId });
      }
    },
    [activate, deactivate],
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({
      onToggle: handleToggle,
    });
  }, [handleToggle]);

  const Table = useTable("users", tableConfig as TableConfig<unknown>);

  useEffect(() => {
    if (activeResult?.isSuccess) {
      Table.boot();
    }
  }, [activeResult]);

  useEffect(() => {
    if (deactiveResult?.isSuccess) {
      Table.boot();
    }
  }, [deactiveResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Manajemen User"
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/setting/user/create")}
            size="sm"
          >
            <Plus size={16} /> Buat User
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
    </Page>
  );
}
