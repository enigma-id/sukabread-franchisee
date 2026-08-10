/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
  lockedFilter,
  onRowClick,
}: {
  lockedFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  onRowClick?: (row: any) => void;
}): TableConfig<any> => ({
  ...config,
  url: "/report/settlement",
  dataKey: "datas",
  lockedFilter,
  filter,
  onRowClick,
  dynamicColumns: (rows: any[]) => {
    if (!rows?.length) return {};

    const firstRow = rows[0];
    const methods = firstRow.payment_methods ?? [];

    const dynamic: Record<string, any> = {};

    methods.forEach((method: string, index: number) => {
      dynamic[method] = {
        title: method,
        align: "right",
        headerClass: "text-right",
        class: "text-left",
        sortable: false,
        component: (row: any) => {
          const vals = row.nominals ?? [];
          return vals[index] !== undefined ? currencyFormat(vals[index]) : "-";
        },
      };
    });

    return {
      date: {
        title: "Date",
        sortable: false,
        component: (row: any) => row.date,
      },
      started_at: {
        title: "Mulai",
        sortable: false,
        component: (row: any) =>
          row.started_at ? formatDateTime(row.started_at) : "-",
      },
      finished_at: {
        title: "Selesai",
        sortable: false,
        component: (row: any) =>
          row.finished_at ? formatDateTime(row.finished_at) : "-",
      },
      ...dynamic,
    };
  },
});

export default createTableConfig;
