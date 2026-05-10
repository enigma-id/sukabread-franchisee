import config from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/sales/item",
  filter,
  columns: {
    name: {
      title: "Nama",
      component: (row: any) => row.name,
    },
    total_qty: {
      title: "Total Terjual",
      align: "right",
      class: "text-right ",
      component: (row: any) => row.total_qty,
    },
    total_order: {
      title: "Total Transaksi",
      align: "right",
      class: "text-right",
      component: (row: any) => row.total_order,
    },
  },
});

export default createTableConfig;
