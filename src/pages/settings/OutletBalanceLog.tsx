import { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { useLazyGetLogQuery } from "@/services/outlet/api";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { currencyFormat } from "@/utils";

export function OutletBalanceLog() {
  useDocumentMeta("Log Saldo Outlet | Sukabread Franchisee", "");

  const [getLog, { data, isLoading }] = useLazyGetLogQuery();

  useEffect(() => {
    getLog({});
  }, [getLog]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Log Saldo Outlet"
        subtitle="Riwayat perubahan saldo outlet."
      />
      <Page.Body className="p-6">
        <div className="bg-white rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">Memuat log...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-base-100 text-base-content/70 uppercase text-xs font-bold border-b border-base-300">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {data?.data?.map((log: any) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">{log.description}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      {currencyFormat(log.amount)}
                    </td>
                  </tr>
                ))}
                {!data?.data?.length && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-base-content/50">
                      Tidak ada log saldo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Page.Body>
    </Page>
  );
}
