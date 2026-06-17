import config from "@/services/table/const";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import type { CatalogOutlet } from "@/services/types/catalog";

const createTableConfig = ({
  onToggle,
  onEdit,
}: {
  onToggle?: (id: string, isActive: boolean) => Promise<void>;
  onEdit?: (row: CatalogOutlet) => void;
}) => ({
  ...config,
  url: "/catalog-outlet",
  columns: {
    name: {
      title: "Item",
      class: "font-medium",
      component: (row: CatalogOutlet) => (
        <div className="flex items-center gap-3">
          {row.catalog.image && (
            <img
              src={row.catalog.image}
              alt={row.catalog.name}
              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
            />
          )}
          <div>
            <div className="font-semibold text-base-content">
              {row.catalog.name}
            </div>
            <div className="text-xs text-base-content/50">
              {row.catalog.code}
            </div>
          </div>
        </div>
      ),
    },
    base_price: {
      title: "Harga Dasar",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: CatalogOutlet) => (
        <span className="font-semibold text-primary">
          {row.catalog.base_price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </span>
      ),
    },
    min_stock: {
      title: "Min Stok",
      class: "text-center font-mono",
      headerClass: "text-center",
    },
    max_stock: {
      title: "Max Stok",
      class: "text-center font-mono",
      headerClass: "text-center",
    },
    is_active: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: CatalogOutlet) => {
        if (!onToggle) return null;
        return (
          <div className="flex justify-center">
            <Toggle
              size="sm"
              variant={row.is_active ? "success" : "neutral"}
              checked={row.is_active}
              onChange={async () => {
                await onToggle(row.id, row.is_active);
              }}
            />
          </div>
        );
      },
    },
    action: {
      title: "",
      width: 64,
      component: (row: CatalogOutlet) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => onEdit?.(row)}
          >
            <Edit2 size={16} />
          </Button>
        </div>
      ),
    },
  },
});

export default createTableConfig;
