/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Page } from "@/components/app/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useMembership } from "@/services/membership/hooks";
import { useEffect } from "react";
import type { Membership } from "@/services/types/membership";
import { Loading } from "@/components/ui";
import { User, Receipt } from "lucide-react";
import { currencyFormat, dateFormat } from "@/utils";

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
        category="Membership"
        title="Detail Membership"
        subtitle={`Informasi detail dan riwayat untuk member: ${membership.name}`}
        backTo={() => navigate(-1)}
      />
      <Page.Body className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Information Column */}
          <div className="xl:col-span-2 space-y-6">
            <div className="card-info card-animate p-6 bg-white border border-slate-100 shadow-sm rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className="font-bold text-xl">{membership.name}</h2>
                  <p className="text-sm text-base-content/60">
                    ID Member: {membership.card_id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <dt className="text-xs text-base-content/50 uppercase font-bold tracking-wider mb-1">
                    Ref Code
                  </dt>
                  <dd className="font-mono font-semibold text-base-content">
                    {membership.reff_code}
                  </dd>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <dt className="text-xs text-base-content/50 uppercase font-bold tracking-wider mb-1">
                    Saldo
                  </dt>
                  <dd className="font-semibold text-primary text-lg">
                    {currencyFormat(membership.saldo)}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Log Column */}
          <div className="xl:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Receipt className="text-primary" size={20} />
                Riwayat Poin
              </h2>
              {log?.length === 0 ? (
                <div className="text-center py-8 text-base-content/50">
                  <p className="text-sm">Tidak ada riwayat</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-100 pr-2">
                  {log?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div>
                        <p className="font-medium text-sm capitalize">
                          {item.reference_type}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {dateFormat(item.created_at)}
                        </p>
                      </div>
                      <span
                        className={`font-mono font-semibold ${
                          item.nominal >= 0 ? "text-success" : "text-error"
                        }`}
                      >
                        {item.nominal >= 0 ? "+" : ""}
                        {currencyFormat(item.nominal)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
