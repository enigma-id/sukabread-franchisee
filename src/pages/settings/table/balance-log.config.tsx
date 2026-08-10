import config from "@/services/table/const";
import { currencyFormat, dateFormat } from "@/utils";
import type { ContractBalanceLog } from "@/services/types/outlet";

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
    },
    nominal: {
      title: "Nominal",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span className="font-medium">{currencyFormat(row.nominal)}</span>
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
