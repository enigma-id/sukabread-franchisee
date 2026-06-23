/* eslint-disable react-hooks/exhaustive-deps */
import { Page } from "@/components/app/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useMembership } from "@/services/membership/hooks";
import { useEffect } from "react";
import type { Membership } from "@/services/types/membership";
import { Loading } from "@/components/ui";
import { currencyFormat } from "@/utils";

export function MembershipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useDocumentMeta("Detail Member | Sukabread Franchisee", "");

  const { show, showResult, getLog, getLogResult } = useMembership();

  useEffect(() => {
    if (id) {
      show({ id });
      getLog({ id });
    }
  }, [id]);

  const data = showResult?.data?.data;
  const log = getLogResult?.data?.data;
  const membership = data as Membership;

  if (showResult.isLoading) return <Loading variant="spinner" size="lg" />;
  if (!membership)
    return (
      <div className="text-center py-12 text-base-content/50">
        Member tidak ditemukan
      </div>
    );

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="CRM"
        title="Detail Membership"
        subtitle={`Informasi detail dan riwayat untuk member: ${membership.name}`}
        backTo={() => navigate(-1)}
      />
      <Page.Body className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-bold text-lg mb-4">Informasi Profil</h2>
            <dl className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-sm text-base-content/60">Nama</dt>
                <dd className="font-semibold">{membership.name}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-sm text-base-content/60">Card ID</dt>
                <dd className="font-mono">{membership.card_id}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-sm text-base-content/60">Ref Code</dt>
                <dd className="font-mono">{membership.reff_code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-base-content/60">Saldo</dt>
                <dd className="font-semibold text-primary">
                  {currencyFormat(membership.saldo)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-bold text-lg mb-4">Riwayat Poin (Log)</h2>
            {log?.length === 0 ? (
              <p className="text-sm text-base-content/50">Tidak ada riwayat</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-base-content/50">
                  Riwayat tersedia ({log?.length ?? 0} entri)
                </p>
              </div>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
