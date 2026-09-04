/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button, Loading } from "@/components";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useFranchiseOutlet } from "@/services/franchiseOutlet/hooks";
import type { FranchiseOutlet } from "@/services/types/franchiseOutlet";
import { getStatusVariant } from "@/utils";
import { ArrowLeft, Pencil, Store } from "lucide-react";

export function OutletDetail() {
  useDocumentMeta(
    "Detail Outlet | Sukabread Franchisee",
    "Detail outlet milik franchise.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = useFranchiseOutlet();

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  if (showResult.isLoading) return <Loading variant='spinner' size='lg' />;

  const outlet = showResult?.data?.data as FranchiseOutlet | undefined;
  if (!outlet)
    return (
      <div className='text-center py-12 text-base-content/50'>
        Outlet tidak ditemukan
      </div>
    );

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Settings'
        title={outlet.name || "Outlet"}
        subtitle='Detail outlet milik franchise.'
        backTo={() => navigate("/setting/outlet")}
        action={
          <Button
            variant='primary'
            onClick={() => navigate(`/setting/outlet/${outlet.id}/update`)}
          >
            <Pencil size={16} className='mr-2' />
            Edit
          </Button>
        }
      />

      <Page.Body>
        {/* Info utama */}
        <div className='card-info card-animate p-5 mb-6'>
          <div className='card-section-header'>
            <div className='card-section-icon'>
              <Store size={18} />
            </div>
            <h2 className='card-section-title'>Informasi Outlet</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'>
            <InfoCell label='Nama Outlet' value={outlet.name || "-"} />
            <InfoCell
              label='Nama Penerima'
              value={outlet.recipient_name || "-"}
            />
            <InfoCell label='No. HP' value={outlet.phone || "-"} />
            <InfoCell
              label='Service Charge'
              value={
                typeof outlet.service_charges === "number"
                  ? `${outlet.service_charges}%`
                  : "-"
              }
            />
            <div>
              <dt className='text-[10px] font-bold uppercase tracking-widest text-base-content/50'>
                Status
              </dt>
              <dd className='mt-1'>
                <Badge
                  variant={getStatusVariant(outlet.is_active ? "active" : "inactive")}
                  appearance='soft'
                >
                  {outlet.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </dd>
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-base-200'>
            <InfoCell label='Alamat' value={outlet.address || "-"} />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            styleType='outline'
            variant='secondary'
            onClick={() => navigate("/setting/outlet")}
          >
            <ArrowLeft size={16} className='mr-2' />
            Kembali
          </Button>
        </div>
      </Page.Body>
    </Page>
  );
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
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
