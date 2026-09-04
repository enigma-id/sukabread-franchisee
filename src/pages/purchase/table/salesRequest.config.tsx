import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components";
import { currencyFormat, formatDate, formatDateTime, getStatusVariant } from "@/utils";
import { Eye, MoreVertical, Pencil, Send, XCircle } from "lucide-react";
import type { SalesRequest } from "@/services/types/salesRequest";

const createTableConfig = ({
  onDetail,
  onEdit,
  onCancel,
  onPublish,
}: {
  onDetail?: (row: SalesRequest) => void;
  onEdit?: (row: SalesRequest) => void;
  onCancel?: (row: SalesRequest) => void;
  onPublish?: (row: SalesRequest) => void;
}) => ({
  ...config,
  url: "/sales/request",
  // Response list: data = { sales_orders: [...], total, page, limit }
  dataKey: "sales_orders",
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      class: "font-medium font-mono text-xs",
      component: (row: SalesRequest) => (
        <div className='flex flex-col'>
          <span className='font-semibold'>{row.code || "-"}</span>
          {row.created_at && (
            <span className='text-[11px] text-slate-400 font-sans'>
              {formatDateTime(row.created_at)}
            </span>
          )}
        </div>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: false,
      component: (row: SalesRequest) => (
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>{row.recipient_name || "-"}</span>
          {row.recipient_phone && (
            <span className='text-xs text-slate-500'>{row.recipient_phone}</span>
          )}
        </div>
      ),
    },
    shipping_date: {
      title: "Tanggal Request",
      sortable: true,
      class: "text-sm",
      component: (row: SalesRequest) => (
        <span>{row.shipping_date ? formatDate(row.shipping_date) : "-"}</span>
      ),
    },
    total_charges: {
      title: "Total",
      sortable: true,
      class: "font-mono text-right font-medium",
      headerClass: "text-right",
      component: (row: SalesRequest) => (
        <span>
          {typeof row.total_charges === "number"
            ? currencyFormat(row.total_charges)
            : "-"}
        </span>
      ),
    },
    document_status: {
      title: "Status",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: SalesRequest) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          appearance='soft'
        >
          {row.document_status || "-"}
        </Badge>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      component: (row: SalesRequest) => (
        <div className='flex justify-end'>
          <Dropdown
            trigger={
              <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
                <MoreVertical className='w-5 h-5 text-slate-600' />
              </button>
            }
            position='end'
            contentClassName='dropdown-content menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
          >
            <Dropdown.Item
              onSelect={() => onDetail?.(row)}
              className='hover:bg-indigo-50 hover:text-indigo-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <Eye className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Detail</span>
                  <span className='text-[11px] text-slate-400'>
                    Lihat detail request
                  </span>
                </div>
              </button>
            </Dropdown.Item>
            {row.document_status === "pending" && (
              <>
                <Dropdown.Item
                  onSelect={() => onEdit?.(row)}
                  className='hover:bg-amber-50 hover:text-amber-600'
                >
                  <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full'>
                    <div className='w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600'>
                      <Pencil className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start leading-tight'>
                      <span className='font-bold text-[13px]'>Edit</span>
                      <span className='text-[11px] text-slate-400'>
                        Ubah data request
                      </span>
                    </div>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onPublish?.(row)}
                  className='hover:bg-emerald-50 hover:text-emerald-600'
                >
                  <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full'>
                    <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                      <Send className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start leading-tight'>
                      <span className='font-bold text-[13px]'>Publish</span>
                      <span className='text-[11px] text-slate-400'>
                        Kirim request ke franchisor
                      </span>
                    </div>
                  </button>
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onCancel?.(row)}
                  className='hover:bg-red-50 hover:text-red-600'
                >
                  <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full'>
                    <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                      <XCircle className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start leading-tight'>
                      <span className='font-bold text-[13px]'>Batalkan</span>
                      <span className='text-[11px] text-slate-400'>
                        Batalkan request
                      </span>
                    </div>
                  </button>
                </Dropdown.Item>
              </>
            )}
          </Dropdown>
        </div>
      ),
    },
  },
});

export default createTableConfig;
