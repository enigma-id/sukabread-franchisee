import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import { Badge } from "@/components";

const getStatusVariant = (status: string) => {
  if (!status) return "default";
  const s = String(status).toUpperCase();
  if (s === "COMPLETED" || s === "FINISHED" || s === "CLOSED" || s === "MATCH")
    return "success";
  if (s === "ONGOING" || s === "OPEN" || s === "ACTIVE") return "primary";
  if (s === "PENDING" || s === "WAITING") return "warning";
  if (s === "CANCELLED" || s === "FAILED" || s === "VOID" || s === "UNMATCH")
    return "error";
  return "default";
};

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/cash-control",
  filter,
  columns: {
    session: {
      title: "Session",
      component: (row: any) => formatDate(row.session),
    },
    cashier: {
      title: "Cashier",
      component: (row: any) => <span className="uppercase">{row.cashier}</span>,
    },
    transaction_cash: {
      title: "Transaksi Cash",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row.transaction_cash),
    },
    topup_cash: {
      title: "Topup Cash",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row.topup_cash),
    },
    session_cash: {
      title: "Setoran Cash",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => currencyFormat(row.session_cash),
    },
    status: {
      title: "Status",
      component: (row: any) => (
        <Badge variant={getStatusVariant(row.status)} appearance="soft">
          {row.status}
        </Badge>
      ),
    },
  },
});

export default createTableConfig;
