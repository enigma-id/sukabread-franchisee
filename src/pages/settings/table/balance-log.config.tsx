import config from "@/services/table/const";
import { currencyFormat, dateFormat, getTypeVariant } from "@/utils";
import type { ContractBalanceLog } from "@/services/types/outlet";
import { Badge } from "@/components";

const createTableConfig = () => ({
  ...config,
  url: "/outlet/balance/log",
  columns: {
    created_at: {
      title: "Waktu",
      sortable: true,
      class: "font-medium",
      component: (row: ContractBalanceLog) => (
        <span>{dateFormat(row.created_at)}</span>
      ),
    },
    reference_type: {
      title: "Tipe",
      sortable: true,
      class: "capitalize",
      component: (row: ContractBalanceLog) => (
        <Badge variant={getTypeVariant(row.reference_type)} appearance='soft'>
          {row?.reference_type?.replace("_", " ")}{" "}
        </Badge>
      ),
    },
    balance_before: {
      title: "Saldo Awal",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span>{currencyFormat(row.balance_before)}</span>
      ),
    },

    nominal: {
      title: "Nominal",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span
          className={`font-semibold ${row.nominal > 0 ? "text-success" : "text-error"}`}
        >
          {currencyFormat(row.nominal)}
        </span>
      ),
    },

    balance_after: {
      title: "Saldo Akhir",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span>{currencyFormat(row.balance_after)}</span>
      ),
    },
  },
});

export default createTableConfig;
