/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";

const createTableConfig = () => ({
  ...config,
  url: "/stock",
  columns: {
    catalog_name: {
      title: "Nama Item",
      class: "font-medium",
      component: (row: any) => row?.ingredient?.name || "-",
    },
    current_stock: {
      title: "Stock",
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: any) => {
        const stock = row.stock_available ?? row.current_stock;
        return <span>{stock}</span>;
      },
    },
    min_stock: {
      title: "Min Stok",
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
    max_stock: {
      title: "Max Stok",
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
  },
});

export default createTableConfig;
