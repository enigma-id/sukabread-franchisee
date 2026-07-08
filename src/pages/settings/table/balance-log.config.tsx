import config from "@/services/table/const";
import { currencyFormat, dateFormat } from "@/utils";
import type { ContractBalanceLog } from "@/services/types/outlet";

const createTableConfig = () => ({
  ...config,
  url: "/outlet/balance/log",
  columns: {
    created_at: {
      title: "Waktu",
      class: "font-medium",
      component: (row: ContractBalanceLog) => (
        <span>{dateFormat(row.created_at)}</span>
      ),
    },
    reference_type: {
      title: "Tipe",
      class: "capitalize",
    },
    nominal: {
      title: "Nominal",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span className="font-medium">{currencyFormat(row.nominal)}</span>
      ),
    },
    balance_before: {
      title: "Saldo Awal",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span>{currencyFormat(row.balance_before)}</span>
      ),
    },
    balance_after: {
      title: "Saldo Akhir",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: ContractBalanceLog) => (
        <span>{currencyFormat(row.balance_after)}</span>
      ),
    },
  },
});

export default createTableConfig;
