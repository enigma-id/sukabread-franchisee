import {
  CalendarDays,
  Wallet,
  TrendingUp,
  CreditCard,
  Tag,
  Zap,
  ListOrdered,
  ChevronRight,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components/ui";
import { useSession } from "@/services/sales/hooks";
import {
  formatDate,
  formatTime,
  isOngoing,
  displayPaymentMethod,
  currencyFormat,
} from "@/utils";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { SalesSession } from "@/services/types";

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { show, showResult } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      show({ id: Number(id) });
    }
  }, [id]);

  const data = showResult?.data?.data;

  if (showResult.isLoading) return <Loading variant="spinner" size="lg" />;
  if (!data)
    return (
      <div className="text-center py-12 text-base-content/50">
        Session tidak ditemukan
      </div>
    );

  const session = data as SalesSession;
  const afterDiscount =
    session.summary_order.total_charges -
    session.summary_order.total_service_charge;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title={`Session #${session.id}`}
        backTo={() => navigate(-1)}
      />
      <Page.Body>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <CalendarDays size={18} />
              </div>
              <h2 className="card-section-title">Session Info</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Session No.</dt>
                <dd className="info-value">{session.id}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal</dt>
                <dd className="info-value">
                  {formatDate(session.transaction_date)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Awal Session</dt>
                <dd className="info-value">{formatTime(session.started_at)}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Akhir Session</dt>
                <dd className="info-value">
                  {isOngoing(session.finished_at) ? (
                    <span className="text-amber-600 font-medium">
                      (Ongoing)
                    </span>
                  ) : (
                    formatTime(session.finished_at)
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Cash Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Wallet size={18} />
              </div>
              <h2 className="card-section-title">Cash Info</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Starting Cash</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.cash_started)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Ending Cash</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.cash_finished)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Expected Cash</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.cash_due)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Outstanding Bill Payments</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.bill_payment)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Sales Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <TrendingUp size={18} />
              </div>
              <h2 className="card-section-title">Sales Info</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Total Sales (Nett)</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.summary_order.total_nett)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Total Discount</dt>
                <dd className="info-value mono text-red-500">
                  {currencyFormat(-session.summary_order.total_discount)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Total After Discount</dt>
                <dd className="info-value mono">
                  {currencyFormat(afterDiscount)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Total Service</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.summary_order.total_service_charge)}
                </dd>
              </div>
              <div className="info-row-total">
                <dt className="info-label">Grand Total</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.summary_order.total_charges)}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Outstanding Bills</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.summary_order.total_openbill)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Pembayaran */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <CreditCard size={18} />
              </div>
              <h2 className="card-section-title">Pembayaran</h2>
            </div>
            {session.cash_payments.length === 0 ? (
              <p className="text-sm text-base-content/50">Tidak ada data</p>
            ) : (
              <dl className="space-y-1">
                {session.cash_payments.map((cp: any, i: number) => (
                  <div key={i} className="info-row">
                    <dt className="info-label">{cp.payment_name ?? "Cash"}</dt>
                    <dd className="info-value mono">
                      {currencyFormat(cp.subtotal)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Kategori */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Tag size={18} />
              </div>
              <h2 className="card-section-title">Kategori</h2>
            </div>
            {session.category_solds.length === 0 ? (
              <p className="text-sm text-base-content/50">Tidak ada data</p>
            ) : (
              <dl className="space-y-1">
                {session.category_solds.map((cat: any, i: number) => (
                  <div key={i} className="info-row">
                    <dt className="info-label">{cat.name}</dt>
                    <div className="flex items-center gap-2">
                      <span className="category-tag">{cat.quantity}</span>
                      <span className="info-value mono text-xs">
                        {currencyFormat(cat.total_charges)}
                      </span>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Topup */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Zap size={18} />
              </div>
              <h2 className="card-section-title">Topup</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Total Topup</dt>
                <dd className="info-value mono">
                  {currencyFormat(session.cash_topup)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="card-table card-animate mt-6">
          <div className="table-header !p-6">
            <div className="table-header-icon">
              <ListOrdered size={16} />
            </div>
            <h2 className="table-header-title">Transaksi</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table
              className="table-hover table-vcenter datatable table"
              width="100%"
            >
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    Tanggal
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    Code
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    Channel
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    Pembayaran
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                    Total Order
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {session.sales_orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-base-content/50"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  session.sales_orders.map((order: any, idx: number) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/sales/session/${session.id}/order/${order.id}`)}
                      className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 hover:cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {formatTime(order.ordered_at)}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {order.code.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {displayPaymentMethod(order.channel?.name ?? null)}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {displayPaymentMethod(
                          order.payment_method?.name ?? null,
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                        {currencyFormat(order.total_charges)}
                      </td>
                      <td>
                        <ChevronRight
                          size={16}
                          className="text-base-content/30"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
