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
              {date?.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-base-content/50">
              {date?.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
    },
    ingredient_name: {
      title: "Item",
      class: "font-medium",
      component: (row: StockLog) => <span>{row.ingredient.name}</span>,
    },
    reference_type: {
      title: "Tipe Referensi",
      class: "text-center",
      headerClass: "text-center",
      component: (row: StockLog) => (
        <Badge variant="info" className="lowercase!">
          {row.reference_type?.replaceAll("_", " ")}
        </Badge>
      ),
    },
    qty_after: {
      title: "Stok Akhir",
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: StockLog) => {
        return <span className="font-mono font-semibold">{row.qty_after}</span>;
      },
    },
  },
});

export default createTableConfig;
