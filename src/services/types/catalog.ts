/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CatalogItem {
  id: string;
  ref_id: string;
  brand_id: string;
  category_id: string;
  code: string;
  name: string;
  base_price: number;
  image: string;
  is_vatable: boolean;
  is_additional: boolean;
  is_custom: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OutletInfo {
  id: string;
  ref_id: string;
  brand_id: string;
  outlet_type_id: string;
  name: string;
  recipient_name: string;
  phone: string;
  address: string;
  region_id: string;
  service_charges: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogOutlet {
  [x: string]: any;
  id: string;
  brand_id: string;
  outlet_id: string;
  catalog_id: string;
  min_stock: number;
  max_stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  catalog: CatalogItem;
  outlet: OutletInfo;
}

export interface CatalogUpdatePayload {
  min_stock: number;
  max_stock: number;
}
