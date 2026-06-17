export interface StockItem {
  id: string;
  catalog_name: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
}

export interface StockLog {
  id: string;
  catalog_name: string;
  action: string; // e.g., "IN", "OUT", "ADJUST"
  quantity: number;
  previous_stock: number;
  current_stock: number;
  created_at: string;
  notes?: string | null;
}
