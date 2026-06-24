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
