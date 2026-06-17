import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui/button";
import {
  useLazyShowListQuery,
  useApproveMutation,
  useRejectMutation,
} from "@/services/withdrawal/api";
import { useEffect } from "react";
import { currencyFormat } from "@/utils";
import { Badge } from "@/components/ui/badge";

export function WithdrawalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, { data: withdrawal, isLoading }] = useLazyShowListQuery();
  const [approve] = useApproveMutation();
  const [reject] = useRejectMutation();

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!id) return;
    if (action === "approve") await approve({ id });
    else await reject({ id });
    navigate("/withdrawal");
  };

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;
  if (!withdrawal)
    return <div className="p-10 text-center">Data tidak ditemukan</div>;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Finance"
        title="Detail Penarikan"
        subtitle={`ID: ${withdrawal.id}`}
      />
      <Page.Body className="p-6">
        <div className="max-w-xl bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between">
            <span className="text-base-content/60">Outlet</span>
            <span className="font-semibold">{withdrawal.outlet?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Jumlah</span>
            <span className="font-bold text-lg">
              {currencyFormat(withdrawal.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Status</span>
            <Badge>{withdrawal.status}</Badge>
          </div>

          {withdrawal.status === "pending" && (
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={() => handleAction("reject")}
                variant="error"
                className="flex-1"
              >
                Tolak
              </Button>
              <Button
                onClick={() => handleAction("approve")}
                variant="primary"
                className="flex-1"
              >
                Setujui
              </Button>
            </div>
          )}
        </div>
      </Page.Body>
    </Page>
  );
}
