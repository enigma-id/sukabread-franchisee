/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";

const createTableConfig = () => ({
  ...config,
  url: "/stock",
  columns: {
    catalog_name: {
      title: "Nama Item",
      sortable: true,
      class: "font-medium",
      component: (row: any) => row?.ingredient?.name || "-",
    },
    current_stock: {
      title: "Stock",
      sortable: true,
      class: "text-center font-mono",
      headerClass: "text-center",
      component: (row: any) => {
        const stock = row.stock_available ?? row.current_stock;
        return <span>{stock}</span>;
      },
    },
    min_stock: {
      title: "Min Stok",
      sortable: true,
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
    max_stock: {
      title: "Max Stok",
      sortable: true,
      class: "text-center font-mono text-base-content/60",
      headerClass: "text-center",
    },
  },
});

export default createTableConfig;
