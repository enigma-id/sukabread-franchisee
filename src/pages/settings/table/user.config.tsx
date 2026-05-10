import config from "@/services/table/const";
import { formatDateTime, isNeverLoggedIn } from "@/utils";
import { Check } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components";

const createTableConfig = ({
  onToggle,
}: {
  onToggle?: (userId: number, isActive: boolean) => Promise<void>;
}) => ({
  ...config,
  url: "/user",
  columns: {
    name: {
      title: "Nama",
      class: "font-medium",
    },
    username: {
      title: "Username",
      class: "text-base-content/60",
      component: (row: any) => `@${row.username}`,
    },
    last_login_at: {
      title: "Login Terakhir",
      class: "text-base-content/60",
      component: (row: any) =>
        isNeverLoggedIn(row.last_login_at)
          ? "-"
          : formatDateTime(row.last_login_at),
    },
    is_active: {
      title: "Status",
      component: (row: any) => {
        if (row.is_supervisor) {
          return (
            <Badge variant="success" appearance="soft">
              <Check size={14} className="mr-1" /> Supervisor
            </Badge>
          );
        }
        if (!onToggle) return null;
        return (
          <Toggle
            size="sm"
            variant={row.is_active ? "success" : "neutral"}
            checked={row.is_active}
            onChange={async () => {
              await onToggle(row.id, row.is_active);
            }}
          />
        );
      },
    },
    action: {
      title: "",
      width: 64,
      component: () => null,
    },
  },
});

export default createTableConfig;
