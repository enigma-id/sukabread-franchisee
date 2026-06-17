import config from "@/services/table/const";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Membership } from "@/services/types/membership";

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
          <span className="text-xs text-base-content/50">{row.phone}</span>
        </div>
      ),
    },
    email: {
      title: "Email",
      class: "text-sm",
      component: (row: Membership) => {
        if (!row.email) return <span className="text-base-content/30">-</span>;
        return <span className="text-base-content/70">{row.email}</span>;
      },
    },
    points: {
      title: "Poin",
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: Membership) => {
        const points = row.points;
        let variant: "default" | "success" | "warning" = "default";
        if (points >= 1000) {
          variant = "success";
        } else if (points >= 500) {
          variant = "warning";
        }

        return (
          <div className="flex justify-center">
            <Badge variant={variant} className="font-mono">
              {points.toLocaleString("id-ID")}
            </Badge>
          </div>
        );
      },
    },
    joined_at: {
      title: "Bergabung",
      class: "text-sm",
      component: (row: Membership) => {
        const date = new Date(row.joined_at);
        return (
          <span className="text-base-content/70">
            {date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
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
