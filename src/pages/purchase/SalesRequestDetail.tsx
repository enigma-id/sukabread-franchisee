/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button, Loading, useEnigmaUI, Modal } from "@/components";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSalesRequest } from "@/services/salesRequest/hooks";
import type { SalesRequest, SalesRequestItem } from "@/services/types/salesRequest";
import { formatDate, formatDateTime, getStatusVariant } from "@/utils";
import { Pencil, Send, ShoppingBag, StickyNote, Truck, XCircle } from "lucide-react";

export function SalesRequestDetail() {
  useDocumentMeta(
    "Detail Sales Request | Sukabread Franchisee",
    "Detail permintaan pembelian barang.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal, closeModal, showToast } = useEnigmaUI();
  const { show, showResult, cancel, cancelResult, publish, publishResult } =
    useSalesRequest();

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  const detail = showResult?.data?.data as SalesRequest | undefined;

  const items = detail?.items ?? [];

  useEffect(() => {
    if (cancelResult.isSuccess) {
      closeModal("cancel-detail");
      showToast({
        message: "Sales Request berhasil dibatalkan",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      cancelResult.reset?.();
      if (id) show({ id });
    }
  }, [cancelResult.isSuccess]);

  useEffect(() => {
    if (publishResult.isSuccess) {
      closeModal("publish-detail");
      showToast({
        message: "Sales Request berhasil di-publish",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      publishResult.reset?.();
      if (id) show({ id });
    }
  }, [publishResult.isSuccess]);

  if (showResult.isLoading) return <Loading variant='spinner' size='lg' />;
  if (!detail)
    return (
      <div className='text-center py-12 text-base-content/50'>
        Sales Request tidak ditemukan
      </div>
    );

  const isPending = detail.document_status === "pending";

  const openCancel = () => {
    openModal({
      id: "cancel-detail",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("cancel-detail")}
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
              <span className='font-mono font-semibold'>{detail.code}</span>?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='error'
              onClick={() => cancel({ id: detail.id })}
              isLoading={cancelResult.isLoading}
            >
              Batalkan
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("cancel-detail")}
              disabled={cancelResult.isLoading}
            >
              Batal
            </Button>
          </Modal.Footer>
        </Modal.Wrapper>
      ),
    });
  };

  const openPublish = () => {
    openModal({
      id: "publish-detail",
      content: (
        <Modal.Wrapper
          open
          onClose={() => closeModal("publish-detail")}
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
              <span className='font-mono font-semibold'>{detail.code}</span>{" "}
              akan dikirim ke franchisor. Lanjutkan?
            </p>
          </Modal.Body>
          <Modal.Footer className='flex gap-2'>
            <Button
              className='flex-1 rounded-xl'
              variant='success'
              onClick={() => publish({ id: detail.id })}
              isLoading={publishResult.isLoading}
            >
              Publish
            </Button>
            <Button
              className='flex-1 rounded-xl'
              styleType='outline'
              variant='secondary'
              onClick={() => closeModal("publish-detail")}
              disabled={publishResult.isLoading}
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
        title={`Sales Request ${detail.code?.toUpperCase() ?? ""}`}
        subtitle='Detail permintaan pembelian barang.'
        backTo={() => navigate("/purchase")}
        action={
          isPending && (
            <div className='flex items-center gap-2'>
              <Button
                styleType='outline'
                variant='info'
                onClick={() => navigate(`/purchase/${detail.id}/update`)}
              >
                <Pencil size={16} className='mr-2' />
                Edit
              </Button>
              <Button variant='success' onClick={openPublish}>
                <Send size={16} className='mr-2' />
                Publish
              </Button>
              <Button variant='error' onClick={openCancel}>
                <XCircle size={16} className='mr-2' />
                Batalkan
              </Button>
            </div>
          )
        }
      />

      <Page.Body>
        {/* Informasi */}
        <div className='card-info card-animate p-5 mb-6'>
          <div className='card-section-header'>
            <div className='card-section-icon'>
              <Truck size={18} />
            </div>
            <h2 className='card-section-title'>Informasi Request</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>
            <InfoCell label='Outlet' value={detail.recipient_name || "-"} />
            <InfoCell
              label='No. HP'
              value={detail.recipient_phone || "-"}
            />
            <InfoCell
              label='Alamat'
              value={detail.recipient_address || "-"}
            />
            <InfoCell
              label='Tanggal Request'
              value={detail.shipping_date ? formatDate(detail.shipping_date) : "-"}
            />
            <InfoCell
              label='Dibuat'
              value={detail.created_at ? formatDateTime(detail.created_at) : "-"}
            />
            <div>
              <dt className='text-[10px] font-bold uppercase tracking-widest text-base-content/50'>
                Status
              </dt>
              <dd className='mt-1'>
                <Badge
                  variant={getStatusVariant(detail.document_status)}
                  appearance='soft'
                >
                  {detail.document_status || "-"}
                </Badge>
              </dd>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className='card-table card-animate'>
          <div className='table-header !p-6'>
            <div className='table-header-icon'>
              <ShoppingBag size={16} />
            </div>
            <h2 className='table-header-title'>Request Items</h2>
            <div className='ml-auto text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-wider'>
              {items.length} Item
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table
              className='table-hover table-vcenter datatable table'
              width='100%'
            >
              <thead>
                <tr>
                  <th className='px-6 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-12'>
                    #
                  </th>
                  <th className='px-6 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Item
                  </th>
                  <th className='px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-32'>
                    QTY
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className='px-6 py-12 text-center text-base-content/50'
                    >
                      Tidak ada item
                    </td>
                  </tr>
                ) : (
                  items.map((item: SalesRequestItem, idx: number) => (
                    <tr
                      key={item.id ?? idx}
                      className='hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors'
                    >
                      <td className='px-6 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {idx + 1}
                      </td>
                      <td className='px-6 py-3 align-middle'>
                        <div className='flex flex-col'>
                          <span className='text-[14px] font-semibold text-base-content'>
                            {item.catalog_name?.trim() || item.catalog_id}
                          </span>
                          {item.catalog_code && (
                            <span className='text-xs text-slate-400'>
                              {item.catalog_code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-base-content'>
                        {item.quantity_ordered}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        {detail.note && (
          <div className='card-info card-animate p-6 mt-6 bg-amber-50/10 border-amber-200/50'>
            <div className='card-section-header'>
              <div className='card-section-icon bg-amber-100 text-amber-600'>
                <StickyNote size={18} />
              </div>
              <h2 className='card-section-title text-amber-800'>Catatan</h2>
            </div>
            <p className='text-sm text-amber-700/80 leading-relaxed'>
              {detail.note}
            </p>
          </div>
        )}
      </Page.Body>
    </Page>
  );
}
function InfoCell({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <dt className='text-[10px] font-bold uppercase tracking-widest text-base-content/50'>
        {label}
      </dt>
      <dd className='mt-1 text-sm font-semibold text-base-content break-words'>
        {value ?? "-"}
      </dd>
    </div>
  );
}
