/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { useFranchiseOutlet } from "@/services/franchiseOutlet/hooks";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNavigate } from "react-router-dom";
import type { CreateFranchiseOutletPayload } from "@/services/types/franchiseOutlet";
import { OutletForm, type OutletFormValues } from "./components/OutletForm";

export function OutletCreate() {
  useDocumentMeta(
    "Buat Outlet | Sukabread Franchisee",
    "Tambah outlet baru.",
  );
  const navigate = useNavigate();
  const { create, createResult } = useFranchiseOutlet();

  useEffect(() => {
    if (createResult?.isSuccess) {
      navigate("/setting/outlet");
    }
  }, [createResult?.isSuccess]);

  const handleSubmit = (values: OutletFormValues) => {
    const payload: CreateFranchiseOutletPayload = {
      name: values.name,
      recipient_name: values.recipient_name,
      phone: values.phone,
      address: values.address,
      service_charges: values.service_charges,
      owner_name: values.owner_name ?? "",
      owner_username: values.owner_username ?? "",
      owner_password: values.owner_password ?? "",
    };
    create(payload as any);
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Settings'
        title='Buat Outlet'
        subtitle='Tambah outlet baru milik franchise.'
        backTo={() => navigate("/setting/outlet")}
      />
      <Page.Body className='p-6'>
        <OutletForm
          onSubmit={handleSubmit}
          submitting={createResult.isLoading}
          onCancel={() => navigate("/setting/outlet")}
        />
      </Page.Body>
    </Page>
  );
}
