/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingBag, StickyNote, Receipt } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Loading, Badge } from "@/components/ui";
import { useOrder } from "@/services/sales/hooks";
import {
  formatDateTime,
  displayPaymentMethod,
  currencyFormat,
  getStatusVariant,
} from "@/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function OrderDetail() {
  useDocumentMeta(
    "Detail Pesanan | Sukabread Franchisee",
    "Detail pesanan pelanggan.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = useOrder();

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id]);

  const data = showResult?.data?.data;

  if (showResult.isLoading) return <Loading variant='spinner' size='lg' />;
  if (!data)
    return (
      <div className='text-center py-12 text-base-content/50'>
        Order tidak ditemukan
      </div>
    );

  const order = data as any;
  const items: any[] = order.items ?? [];
  const change = Math.max(order.total_payment - order.total_charges, 0);
  const totalQty = items.reduce(
    (acc: number, it: any) => acc + (it.quantity ?? 0),
    0,
  );

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Sales'
        title={`Order ${order.code.toUpperCase()}`}
        subtitle={
          order.status === "cancelled"
            ? "Detail Cancel Order"
            : "Detail pesanan pelanggan"
        }
        backTo={() => navigate(-1)}
      />

      <Page.Body>
        {/* Informasi */}
        <div className='card-info card-animate p-5 mb-6'>
          <div className='card-section-header'>
            <div className='card-section-icon'>
              <Receipt size={18} />
            </div>
            <h2 className='card-section-title'>Order</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>
            <InfoCell label='Bill Name' value={order.bill_name || "-"} />
            <InfoCell
              label='Order Date'
              value={formatDateTime(order.paid_at || order.created_at)}
            />
            <InfoCell
              label='Kasir'
              value={order.session?.cashier?.name}
              uppercase
            />
            <InfoCell
              label='Channel'
              value={displayPaymentMethod(order?.sales_channel?.name ?? null)}
            />
            <InfoCell
              label='Pembayaran'
              value={displayPaymentMethod(order.payment_method?.name ?? null)}
            />
            <InfoCell label='Payment Ref' value={order.payment_ref || "-"} />
            <InfoCell
              label='Member'
              value={order.membership?.name || "-"}
              uppercase
            />
            <div>
              <dt className='text-[10px] font-bold uppercase tracking-widest text-base-content/50'>
                Status
              </dt>
              <dd className='mt-1'>
                <Badge
                  variant={getStatusVariant(order.status)}
                  appearance='soft'
                >
                  {order.status}
                </Badge>
              </dd>
            </div>
          </div>

          {order.status === "cancelled" && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-base-200'>
              <InfoCell
                label='Alasan Pembatalan'
                value={order.cancelled_reason || "-"}
                capitalize
              />
              <InfoCell
                label='Dibatalkan Oleh'
                value={order.cancelled_by || "-"}
                uppercase
              />
              <InfoCell
                label='Waktu Pembatalan'
                value={formatDateTime(order.cancelled_at) || "-"}
              />
            </div>
          )}
        </div>

        <div className='space-y-6'>
          <div className='card-table card-animate'>
              <div className='table-header !p-6'>
                <div className='table-header-icon'>
                  <ShoppingBag size={16} />
                </div>
                <h2 className='table-header-title'>Order Items</h2>
                <div className='ml-auto text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-wider'>
                  {totalQty} Items
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
                      <th className='px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-24'>
                        QTY
                      </th>
                      <th className='px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-56'>
                        Price
                      </th>
                      <th className='px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-48'>
                        Discount
                      </th>
                      <th className='px-6 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none w-60'>
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className='px-6 py-12 text-center text-base-content/50'
                        >
                          Tidak ada item
                        </td>
                      </tr>
                    ) : (
                      items.map((item: any, idx: number) => (
                        <OrderItemRow key={item.id} item={item} index={idx} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Ringkasan */}
              <div className='bg-base-200/20 p-6 border-t border-base-200'>
                <div className='flex justify-end'>
                  <div className='w-full max-w-sm'>
                    <dl className='space-y-3'>
                      <div className='flex justify-between items-center text-[14px]'>
                        <dt className='text-base-content/70 font-medium'>Subtotal</dt>
                        <dd className='font-mono font-semibold text-base-content'>
                          {currencyFormat(order.total_bill)}
                        </dd>
                      </div>
                      {order.discount_value > 0 && (
                        <div className='flex justify-between items-center text-[14px]'>
                          <dt className='text-red-500 font-medium'>
                            Discount
                            {order.is_discount_percentage
                              ? ` (${order.discount_percentage}%)`
                              : ""}
                          </dt>
                          <dd className='font-mono font-semibold text-red-500'>
                            -{currencyFormat(order.discount_value)}
                          </dd>
                        </div>
                      )}
                      {order.service_charge_value > 0 && (
                        <div className='flex justify-between items-center text-[14px]'>
                          <dt className='text-base-content/70 font-medium'>
                            Service Charge
                            {order.service_charge_percentage
                              ? ` (${order.service_charge_percentage}%)`
                              : ""}
                          </dt>
                          <dd className='font-mono font-semibold text-base-content'>
                            {currencyFormat(order.service_charge_value)}
                          </dd>
                        </div>
                      )}
                      <div className='flex justify-between items-center text-[14px]'>
                        <dt className='text-base-content/70 font-medium'>Total</dt>
                        <dd className='font-mono font-semibold text-base-content'>
                          {currencyFormat(order.total_charges)}
                        </dd>
                      </div>
                      {order.status !== "cancelled" && (
                        <div className='flex justify-between items-center text-[14px] pt-2 border-t border-base-200/60'>
                          <dt className='text-base-content/70 font-medium'>Dibayar</dt>
                          <dd className='font-mono font-semibold text-base-content'>
                            {currencyFormat(order.total_payment)}
                          </dd>
                        </div>
                      )}
                      {order.status !== "cancelled" && change > 0 && (
                        <div className='flex justify-between items-center text-[14px]'>
                          <dt className='text-base-content/70 font-medium'>
                            Kembalian
                          </dt>
                          <dd className='font-mono font-semibold text-green-600'>
                            {currencyFormat(change)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className='card-info card-animate p-6 bg-amber-50/10 border-amber-200/50'>
                <div className='card-section-header'>
                  <div className='card-section-icon bg-amber-100 text-amber-600'>
                    <StickyNote size={18} />
                  </div>
                  <h2 className='card-section-title text-amber-800'>
                    Order Note
                  </h2>
                </div>
                <p className='text-sm text-amber-700/80 leading-relaxed'>
                  {order.note}
                </p>
              </div>
            )}
        </div>
      </Page.Body>
    </Page>
  );
}

function InfoCell({
  label,
  value,
  uppercase,
  capitalize,
}: {
  label: string;
  value: any;
  uppercase?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div>
      <dt className='text-[10px] font-bold uppercase tracking-widest text-base-content/50'>
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-semibold text-base-content ${uppercase ? "uppercase" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? "-"}
      </dd>
    </div>
  );
}

function OrderItemRow({ item, index }: { item: any; index: number }) {
  return (
    <>
      <tr className='hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors group'>
        <td className='px-6 py-3 align-middle text-[13px] font-medium text-gray-700'>
          {index + 1}
        </td>
        <td className='px-6 py-3 align-middle'>
          <span className='text-[14px] font-semibold text-base-content'>
            {item.catalog_name || item.catalog?.name || "-"}
          </span>
          {item.category_name && (
            <span className='ml-2 text-[11px] font-medium uppercase tracking-wide text-base-content/40'>
              {item.category_name}
            </span>
          )}
        </td>
        <td className='px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-base-content'>
          {item.quantity}
        </td>
        <td className='px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-base-content'>
          {currencyFormat(item.unit_nett)}
        </td>
        <td className='px-6 py-3 align-middle text-right text-[14px] font-mono font-medium text-red-500'>
          {item.discount_value > 0 ? `-${currencyFormat(item.discount_value)}` : "-"}
        </td>
        <td className='px-6 py-3 align-middle text-right text-[14px] font-mono font-bold text-base-content'>
          {currencyFormat(item.unit_bill * item.quantity)}
        </td>
      </tr>
      {(item.addons ?? []).map((addon: any) => (
        <tr
          key={addon.id}
          className='bg-slate-50/60 border-b border-gray-100 last:border-0'
        >
          <td className='px-6 py-2 align-middle' />
          <td className='px-6 py-2 align-middle'>
            <span className='text-[13px] font-medium text-blue-600'>
              + {addon.catalog_name || "-"}
            </span>
          </td>
          <td className='px-6 py-2 align-middle text-right text-[13px] font-mono text-base-content/70'>
            {addon.quantity}
          </td>
          <td className='px-6 py-2 align-middle text-right text-[13px] font-mono text-base-content/70'>
            {currencyFormat(addon.unit_nett)}
          </td>
          <td className='px-6 py-2 align-middle text-right text-[13px] font-mono text-base-content/70'>
            {addon.discount_value > 0 ? `-${currencyFormat(addon.discount_value)}` : "-"}
          </td>
          <td className='px-6 py-2 align-middle text-right text-[13px] font-mono font-medium text-base-content/70'>
            {currencyFormat(addon.unit_bill * addon.quantity)}
          </td>
        </tr>
      ))}
    </>
  );
}
