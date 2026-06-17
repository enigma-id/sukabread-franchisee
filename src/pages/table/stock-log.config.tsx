import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { StockLog } from "@/services/types/stock";

const createTableConfig = () => ({
  ...config,
  url: "/stock/log",
  columns: {
    created_at: {
      title: "Waktu",
      class: "font-medium text-sm",
      component: (row: StockLog) => {
        const date = new Date(row.created_at);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-base-content">
              {date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-base-content/50">
              {date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
    },
    catalog_name: {
      title: "Item",
      class: "font-medium",
    },
    action: {
      title: "Aksi",
      class: "text-center",
      headerClass: "text-center",
      component: (row: StockLog) => {
        const actionMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" }> = {
          IN: { label: "Masuk", variant: "success" },
          OUT: { label: "Keluar", variant: "error" },
          ADJUST: { label: "Adjust", variant: "warning" },
        };
        const { label, variant } = actionMap[row.action] || { label: row.action, variant: "default" };

        return (
          <div className="flex justify-center">
            <Badge variant={variant}>{label}</Badge>
          </div>
        );
      },
    },
    quantity: {
      title: "Qty",
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: StockLog) => {
        const isPositive = row.quantity >= 0;
        return (
          <span className={`font-mono font-semibold ${isPositive ? "text-success" : "text-error"}`}>
            {isPositive ? "+" : ""}{row.quantity.toLocaleString("id-ID")}
          </span>
        );
      },
    },
    previous_stock: {
      title: "Stok Sebelum",
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
    current_stock: {
      title: "Stok Sesudah",
      class: "text-center font-mono",
      headerClass: "text-center",
    },
    notes: {
      title: "Catatan",
      class: "text-sm text-base-content/70",
      component: (row: StockLog) => {
        if (!row.notes) return <span className="text-base-content/30">-</span>;
        return <span className="truncate max-w-[200px] block">{row.notes}</span>;
      },
    },
  },
});

export default createTableConfig;
