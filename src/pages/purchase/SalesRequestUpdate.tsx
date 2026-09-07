/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading, useEnigmaUI } from "@/components";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSalesRequest } from "@/services/salesRequest/hooks";
import type { SalesRequest } from "@/services/types/salesRequest";
import { Save } from "lucide-react";
import { SalesRequestForm, type SalesRequestFormValues } from "./components/SalesRequestForm";

export function SalesRequestUpdate() {
  useDocumentMeta(
    "Ubah Sales Request | Sukabread Franchisee",
    "Perbarui permintaan pembelian barang.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { show, showResult, update, updateResult } = useSalesRequest();
  const { isLoading: isUpdating, isSuccess } = updateResult;

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  const detail = showResult?.data?.data as SalesRequest | undefined;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Sales Request berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      updateResult.reset?.();
      navigate(`/purchase/${id}`, { replace: true });
    }
  }, [isSuccess]);

  const handleSubmit = (values: SalesRequestFormValues) => {
    if (!id) return;
    update({
      id,
      payload: {
        outlet_id: values.outlet_id,
        recipient_name: values.recipient_name,
        recipient_phone: values.recipient_phone,
        recipient_address: values.recipient_address,
        note: values.note,
        shipping_date: values.shipping_date,
        items: values.items,
      } as any,
    });
  };

  if (showResult.isLoading) return <Loading variant='spinner' size='lg' />;
  if (!detail)
    return (
      <div className='text-center py-12 text-base-content/50'>
        Sales Request tidak ditemukan
      </div>
    );

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Transaksi'
        title={`Ubah ${detail.code?.toUpperCase() ?? "Sales Request"}`}
        subtitle='Perbarui permintaan pembelian barang.'
        backTo={() => navigate(`/purchase/${id}`)}
        action={
          <Button
            variant='success'
            type='submit'
            form='sales-request-form'
            isLoading={isUpdating}
          >
            <Save className='w-4 h-4 mr-2' />
            Simpan Perubahan
          </Button>
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        <SalesRequestForm
          id='sales-request-form'
          initialData={detail}
          onSubmit={handleSubmit}
          submitting={isUpdating}
        />
      </Page.Body>
    </Page>
  );
}
