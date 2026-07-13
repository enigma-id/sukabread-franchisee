import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { StockLog } from "@/services/types/stock";
import { dateFormat } from "@/utils";

const createTableConfig = () => ({
  ...config,
  url: "/stock/log",
  columns: {
    created_at: {
      title: "Waktu",
      class: "font-medium text-sm",
      component: (row: StockLog) => {
        return (
          <span className="font-medium text-base-content">
            {dateFormat(row.created_at)}
          </span>
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
