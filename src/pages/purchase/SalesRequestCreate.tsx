/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, useEnigmaUI } from "@/components";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSalesRequest } from "@/services/salesRequest/hooks";
import { Save } from "lucide-react";
import { SalesRequestForm, type SalesRequestFormValues } from "./components/SalesRequestForm";

export function SalesRequestCreate() {
  useDocumentMeta(
    "Buat Sales Request | Sukabread Franchisee",
    "Buat permintaan pembelian barang.",
  );
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { create, createResult } = useSalesRequest();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Sales Request berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      const resData = responseData as any;
      const newId = resData?.data?.id;
      createResult.reset?.();
      if (newId) {
        navigate(`/purchase/${newId}`, { replace: true });
      } else {
        navigate("/purchase", { replace: true });
      }
    }
  }, [isSuccess, responseData]);

  const handleSubmit = (values: SalesRequestFormValues) => {
    create(values as any);
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Transaksi'
        title='Buat Sales Request'
        subtitle='Buat permintaan pembelian barang baru.'
        backTo={() => navigate("/purchase")}
        action={
          <Button
            variant='success'
            type='submit'
            form='sales-request-form'
            isLoading={isCreating}
          >
            <Save className='w-4 h-4 mr-2' />
            Simpan Request
          </Button>
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        <SalesRequestForm
          id='sales-request-form'
          onSubmit={handleSubmit}
          submitting={isCreating}
        />
      </Page.Body>
    </Page>
  );
}
