/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components";
import { useFranchiseOutlet } from "@/services/franchiseOutlet/hooks";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useNavigate, useParams } from "react-router-dom";
import type {
  UpdateFranchiseOutletPayload,
  FranchiseOutlet,
} from "@/services/types/franchiseOutlet";
import { OutletForm, type OutletFormValues } from "./components/OutletForm";

export function OutletUpdate() {
  useDocumentMeta(
    "Ubah Outlet | Sukabread Franchisee",
    "Perbarui data outlet.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, update, showResult, updateResult } = useFranchiseOutlet();
  const [outlet, setOutlet] = useState<FranchiseOutlet | null>(null);

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  useEffect(() => {
    if (showResult?.isSuccess) {
      const d = showResult.data?.data as FranchiseOutlet | undefined;
      if (d) setOutlet(d);
    }
  }, [showResult]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      navigate("/setting/outlet");
    }
  }, [updateResult?.isSuccess]);

  const handleSubmit = (values: OutletFormValues) => {
    const payload: UpdateFranchiseOutletPayload = {
      name: values.name,
      recipient_name: values.recipient_name,
      phone: values.phone,
      address: values.address,
      service_charges: values.service_charges,
    };
    if (id) update({ id, payload: payload as any });
  };

  if (showResult.isLoading || !outlet) return <Loading variant='spinner' size='lg' />;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Settings'
        title='Ubah Outlet'
        subtitle='Perbarui data outlet.'
        backTo={() => navigate("/setting/outlet")}
      />
      <Page.Body className='p-6'>
        <OutletForm
          initialData={outlet}
          isEdit
          onSubmit={handleSubmit}
          submitting={updateResult.isLoading}
          onCancel={() => navigate("/setting/outlet")}
        />
      </Page.Body>
    </Page>
  );
}
