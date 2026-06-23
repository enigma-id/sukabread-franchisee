/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClipboardList,
  ShoppingBag,
  StickyNote,
  Receipt,
  User,
  CreditCard,
  Tag,
  Hash,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components/ui";
import { useOrder } from "@/services/sales/hooks";
import { formatDateTime, displayPaymentMethod, currencyFormat } from "@/utils";
// import type { SalesOrder, SalesOrderItem } from "@/services/types";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function OrderDetail() {
  useDocumentMeta(
    "Order Detail | Sukabread Franchisee",
    "Manage your OrderDetail efficiently within the Sukabread Franchisee portal.",
  );
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { show, showResult } = useOrder();

  useEffect(() => {
    if (orderId) {
      show({ id: Number(orderId) });
    }
  }, [orderId]);

  const data = showResult?.data?.data;

  if (showResult.isLoading) return <Loading variant="spinner" size="lg" />;
  if (!data)
    return (
      <div className="text-center py-12 text-base-content/50">
        Order tidak ditemukan
      </div>
    );

  const order = data as any;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title={`Order ${order.code.toUpperCase()}`}
        backTo={() => navigate(-1)}
      />
      <Page.Body>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Order Items */}
          <div className="xl:col-span-8 space-y-6">
            <div className="card-table card-animate">
              <div className="table-header !p-6">
                <div className="table-header-icon">
                  <ShoppingBag size={16} />
                </div>
                <h2 className="table-header-title">Order Items</h2>
                <div className="ml-auto text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-wider">
                  {order.sales_order_items.length} Items
                </div>
              </div>
              <div className="overflow-x-auto">
                <table
                  className="table-hover table-vcenter datatable table"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-12">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none">
                        Item
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-24">
                        QTY
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-36">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-36">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.sales_order_items.map((item: any, idx: number) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors group"
                      >
                        <td className="px-6 py-3 align-middle text-[13px] font-medium text-gray-700">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <span
                            className={`text-[14px] font-semibold ${item.additional_id ? "text-blue-600" : "text-base-content"}`}
                          >
                            {item.additional_id ? "+ " : ""}
                            {item.catalog.name}
                          </span>
                        </td>
                        <td className="px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-base-content">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-base-content">
                          {currencyFormat(item.unit_nett)}
                        </td>
                        <td className="px-6 py-3 align-middle text-right text-[14px] font-mono font-bold text-base-content">
                          {currencyFormat(item.total_nett)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Pricing Footer */}
              <div className="bg-base-200/20 p-6 border-t border-base-200">
                <div className="flex justify-end">
                  <div className="w-full max-w-sm">
                    <dl className="space-y-3">
                      <div className="flex justify-between items-center text-[14px]">
                        <dt className="text-base-content/70 font-medium">
                          Subtotal
                        </dt>
                        <dd className="font-mono font-semibold text-base-content">
                          {currencyFormat(order.total_bill)}
                        </dd>
                      </div>
                      {order.discount_value > 0 && (
                        <div className="flex justify-between items-center text-[14px]">
                          <dt className="text-red-500 font-medium">Discount</dt>
                          <dd className="font-mono font-semibold text-red-500">
                            -{currencyFormat(order.discount_value)}
                          </dd>
                        </div>
                      )}
                      {order.service_charge && (
                        <div className="flex justify-between items-center text-[14px]">
                          <dt className="text-base-content/70 font-medium">
                            Service Charge
                          </dt>
                          <dd className="font-mono font-semibold text-base-content">
                            {currencyFormat(order.service_charge_value)}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 mt-4 border-t border-base-200/60">
                        <dt className="text-base font-bold text-base-content uppercase tracking-wider">
                          Total
                        </dt>
                        <dd className="text-xl font-mono font-black text-primary">
                          {currencyFormat(order.total_charges)}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-base-content/40 mt-2">
                        <dt className="uppercase tracking-wider font-bold">
                          Tax Included
                        </dt>
                        <dd className="font-mono font-semibold">
                          {currencyFormat(order.subtotal_tax)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className="card-info card-animate p-6 bg-amber-50/10 border-amber-200/50">
                <div className="card-section-header">
                  <div className="card-section-icon bg-amber-100 text-amber-600">
                    <StickyNote size={18} />
                  </div>
                  <h2 className="card-section-title text-amber-800">
                    Order Note
                  </h2>
                </div>
                <p className="text-sm text-amber-700/80 leading-relaxed">
                  {order.note}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Pricing */}
          <div className="xl:col-span-4 space-y-6">
            {/* Quick Info */}
            <div className="card-info card-animate p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Receipt size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary tracking-widest uppercase mb-1">
                    Order Date
                  </h3>
                  <p className="text-base font-semibold text-base-content">
                    {formatDateTime(order.ordered_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata Info */}
            <div className="card-info card-animate p-6">
              <div className="card-section-header">
                <div className="card-section-icon">
                  <ClipboardList size={18} />
                </div>
                <h2 className="card-section-title">Informasi</h2>
              </div>
              <dl className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                    <User size={14} />
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                      Kasir
                    </dt>
                    <dd className="text-sm font-semibold text-base-content uppercase">
                      {order.session.cashier.name}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                    <Tag size={14} />
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                      Channel
                    </dt>
                    <dd className="text-sm font-semibold text-base-content">
                      {displayPaymentMethod(order.channel?.name ?? null)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                      Pembayaran
                    </dt>
                    <dd className="text-sm font-semibold text-base-content">
                      {displayPaymentMethod(order.payment_method?.name ?? null)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-base-content/50">
                    <Hash size={14} />
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                      Payment Ref
                    </dt>
                    <dd className="text-sm font-semibold text-base-content">
                      {order.payment_ref ?? "-"}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
