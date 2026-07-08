import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { ContractPaymentMethod } from "@/services/types";

const createTableConfig = () => ({
  ...config,
  url: "/payment-method",
  columns: {
    name: {
      title: "Nama",
      class: "font-medium",
      component: (row: ContractPaymentMethod) => (
        <span>{row.name}</span>
      ),
    },
    provider: {
      title: "Provider",
      class: "capitalize",
      component: (row: ContractPaymentMethod) => (
        <span>{row.provider}</span>
      ),
    },
    is_active: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: ContractPaymentMethod) => (
        <Badge
          variant={row.is_active ? "success" : "default"}
          appearance="soft"
        >
          {row.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  },
});

export default createTableConfig;
