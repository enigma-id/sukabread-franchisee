export interface Ingredient {
  id: string;
  ref_id: string;
  brand_id: string;
  code: string;
  name: string;
  fraction: number;
  measurement: string;
  unit_price: number;
  unit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockLog {
  id: string;
  brand_id: string;
  outlet_id: string;
  ingredient_id: string;
  reference_id: string;
  reference_type: string;
  qty_after: number;
  created_at: string;
  ingredient: Ingredient;
}

// Contract-aligned types
export interface ContractStockItem {
  id: string;
  catalog_id: string;
  catalog_name: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  fraction: { id: string; name: string };
}

export interface ContractStockLog {
  id: string;
  catalog_id: string;
  catalog_name: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  stock_before: number;
  stock_after: number;
  reference: string;
  note: string;
  created_at: string;
}
