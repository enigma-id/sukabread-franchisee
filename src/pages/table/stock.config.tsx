/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";

const createTableConfig = () => ({
  ...config,
  url: "/stock",
  columns: {
    catalog_name: {
      title: "Nama Item",
      class: "font-medium",
      component: (row: any) => row?.ingredient?.name || "-",
    },
    current_stock: {
      title: "Stock",
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: any) => {
        const stock = row.stock_available ?? row.current_stock;
        const min = row.min_stock;
        const max = row.max_stock;

        let variant: "default" | "warning" | "error" | "success" = "default";
        if (stock <= min) {
          variant = "error";
        } else if (stock >= max) {
          variant = "success";
        } else if (stock <= min + Math.floor((max - min) * 0.3)) {
          variant = "warning";
        }

        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="font-mono">
              {stock}
            </Badge>
          </div>
        );
      },
    },
    min_stock: {
      title: "Min Stok",
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
    max_stock: {
      title: "Max Stok",
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
  },
});

export default createTableConfig;
