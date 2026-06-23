import config from "@/services/table/const";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Membership } from "@/services/types/membership";
import { dateFormat } from "@/utils";

const createTableConfig = ({
  onView,
}: {
  onView?: (row: Membership) => void;
}) => ({
  ...config,
  url: "/membership",
  columns: {
    name: {
      title: "Nama Member",
      class: "font-medium",
      component: (row: Membership) => (
        <div className="flex flex-col">
          <span className="font-semibold text-base-content">{row.name}</span>
          <span className="text-xs text-base-content/50">{row.card_id}</span>
        </div>
      ),
    },
    reff_code: {
      title: "Ref Code",
      class: "text-sm text-base-content/70",
      component: (row: Membership) => <span>{row.reff_code}</span>,
    },
    saldo: {
      title: "Saldo",
      class: "text-right font-mono",
      headerClass: "text-right",
      format_number: true,
    },
    updated_at: {
      title: "Terakhir Diupdate",
      class: "text-sm",
      component: (row: Membership) => {
        return (
          <span className="text-base-content/70">
            {dateFormat(row.updated_at)}
          </span>
        );
      },
    },
    action: {
      title: "",
      width: 64,
      component: (row: Membership) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => onView?.(row)}
          >
            <Eye size={16} />
          </Button>
        </div>
      ),
    },
  },
});

export default createTableConfig;
