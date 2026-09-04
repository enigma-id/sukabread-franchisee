import config from "@/services/table/const";
import { formatDateTime } from "@/utils";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";
import { Dropdown } from "@/components";
import type { FranchiseOutlet } from "@/services/types/franchiseOutlet";

const createTableConfig = ({
  onDetail,
  onEdit,
  onRemove,
}: {
  onDetail?: (row: FranchiseOutlet) => void;
  onEdit?: (row: FranchiseOutlet) => void;
  onRemove?: (row: FranchiseOutlet) => void;
}) => ({
  ...config,
  url: "/franchise/outlets",
  // Response list: data = { outlets: [...], total, page, limit }
  dataKey: "outlets",
  columns: {
    name: {
      title: "Nama Outlet",
      sortable: true,
      class: "font-medium",
      component: (row: FranchiseOutlet) => (
        <div className='flex flex-col'>
          <span
            role='button'
            tabIndex={0}
            onClick={() => onDetail?.(row)}
            onKeyDown={(e) => e.key === "Enter" && onDetail?.(row)}
            className='text-sm font-semibold text-base-content cursor-pointer hover:text-primary transition-colors'
          >
            {row.name || "-"}
          </span>
          {row.recipient_name && (
            <span className='text-xs text-slate-500'>
              {row.recipient_name}
            </span>
          )}
        </div>
      ),
    },
    phone: {
      title: "No. HP",
      sortable: false,
      class: "text-sm text-base-content/70",
      component: (row: FranchiseOutlet) => <span>{row.phone || "-"}</span>,
    },
    address: {
      title: "Alamat",
      sortable: false,
      class: "text-sm text-base-content/70 max-w-56",
      component: (row: FranchiseOutlet) => (
        <span className='block truncate' title={row.address || ""}>
          {row.address || "-"}
        </span>
      ),
    },
    service_charges: {
      title: "Service Charge",
      sortable: true,
      class: "font-mono text-right font-medium",
      headerClass: "text-right",
      component: (row: FranchiseOutlet) => (
        <span>
          {typeof row.service_charges === "number"
            ? `${row.service_charges}%`
            : "-"}
        </span>
      ),
    },
    created_at: {
      title: "Dibuat",
      sortable: true,
      class: "text-sm",
      component: (row: FranchiseOutlet) => (
        <span>{row.created_at ? formatDateTime(row.created_at) : "-"}</span>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      component: (row: FranchiseOutlet) => (
        <Dropdown
          trigger={
            <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
              <MoreVertical className='w-5 h-5 text-slate-600' />
            </button>
          }
          position='end'
          contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
        >
          <Dropdown.Item
            onSelect={() => onDetail?.(row)}
            className='hover:bg-indigo-50 hover:text-indigo-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                <Eye className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Detail</span>
                <span className='text-[11px] text-slate-400'>
                  Lihat info outlet
                </span>
              </div>
            </button>
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => onEdit?.(row)}
            className='hover:bg-indigo-50 hover:text-indigo-600'
          >
            <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                <Pencil className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Edit</span>
                <span className='text-[11px] text-slate-400'>
                  Ubah data outlet
                </span>
              </div>
            </button>
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => onRemove?.(row)}
            className='hover:bg-red-50 hover:text-red-600'
          >
            <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                <Trash className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Hapus</span>
                <span className='text-[11px] text-slate-400'>
                  Hapus outlet
                </span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
