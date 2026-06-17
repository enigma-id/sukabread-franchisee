# Research: Franchise API Alignment & Synchronization

**Task ID:** api-synchronization
**Date:** 2026-06-04
**Status:** In Progress

---

## Executive Summary

Riset ini bertujuan untuk melakukan audit menyeluruh terhadap `Franchise.postman_collection.json` dan membandingkannya dengan implementasi `src/services/` saat ini. Terdapat beberapa modul baru yang belum ter-implementasi dan perubahan *path* serta *payload* pada modul yang sudah ada.

---

## API Comparison & Gap Analysis

Berikut adalah tabel perbandingan komprehensif antara API yang saat ini ada di codebase (`src/services/`) dengan spesifikasi terbaru dari **Franchise Postman Collection**:

| Current Service / File | Method | Current Path (Codebase) | Target Path (Postman Collection) | Status / Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **authApi** | `POST` | `/auth/signin` | `/auth/login` | ⚠️ **Sync Needed**: Update path & change body from `username` to `identifier`. |
| **authApi** | `GET` | `/auth/me` | `/profile/me` | ⚠️ **Sync Needed**: Move to a new `profileApi` service. |
| **authApi** | `PUT` | `/auth/me` | `/profile/me` | ⚠️ **Sync Needed**: Move to a new `profileApi` service. |
| **catalogApi** | `GET` | `/catalog-outlet` | `/catalog-outlet` | ✅ **Matches** |
| **catalogApi** | `PUT` | `/catalog-outlet/:id` | `/catalog-outlet/:id` | ✅ **Matches** |
| **catalogApi** | `PUT` | `/catalog-outlet/:id/active` | `/catalog-outlet/:id/activate` | ❌ **Fix Path** (Mismatch: `/active` vs `/activate`) |
| **catalogApi** | `PUT` | `/catalog-outlet/:id/deactive` | `/catalog-outlet/:id/deactivate` | ❌ **Fix Path** (Mismatch: `/deactive` vs `/deactivate`) |
| **salesApi** | `GET` | `/sales/session` | `/sales/session` | ✅ **Matches** |
| **salesApi** | `GET` | `/sales/session/:id` | `/sales/session/:id` | ✅ **Matches** |
| **salesApi** | `GET` | `/sales/order/:id` | `/sales/order/:id` | ✅ **Matches** |
| *None* | `GET` | *Not Implemented* | `/membership` | 🆕 **New Service**: Create `membershipApi` |
| *None* | `GET` | *Not Implemented* | `/membership/:id` | 🆕 **New Service**: Create `membershipApi` |
| *None* | `GET` | *Not Implemented* | `/membership/:id/log` | 🆕 **New Service**: Create `membershipApi` |
| *None* | `GET` | *Not Implemented* | `/stock` | 🆕 **New Service**: Create `stockApi` |
| *None* | `GET` | *Not Implemented* | `/stock/log` | 🆕 **New Service**: Create `stockApi` |
| *None* | `PUT` | *Not Implemented* | `/outlet` | 🆕 **New Service**: Create `outletApi` to update service charges. |
| **userApi** (All) | Varies | `/user/*` | *Not in Collection* | ⚠️ **Legacy/Current Only**: Excluded from Postman. Keep intact. |
| **reportApi** (All) | Varies | `/report/*` | *Not in Collection* | ⚠️ **Legacy/Current Only**: Excluded from Postman. Keep intact. |

---

## Detailed Payload Comparison

### 1. Auth Login Payload
- **Postman schema:**
  ```json
  {
      "identifier": "nurdin",
      "password": "..."
  }
  ```
- **Frontend `LoginRequest` (Mismatched):**
  Uses `username` instead of `identifier`. Must be updated to use `identifier: string`.

### 2. Catalog Outlet Update Payload
- **Postman schema:**
  ```json
  {
      "min_stock": 5,
      "max_stock": 10
  }
  ```
- **Frontend status:** Not typed. A new type `CatalogUpdatePayload` needs to be defined in `src/services/types/catalog.ts`.

### 3. Outlet Update Payload
- **Postman schema:**
  ```json
  {
      "service_charges": 2
  }
  ```
- **Frontend status:** Missing. A new type `OutletUpdatePayload` must be defined.

### 4. Profile Update Payload
- **Postman schema:**
  ```json
  {
      "name": "Super",
      "password": "",
      "confirm_password": ""
  }
  ```
- **Frontend status:** Matches `ProfileUpdateRequest` (attributes are name, password, confirm_password).

---

## Proposed TypeScript Interfaces

### Membership Types (New)
```typescript
export interface Membership {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  joined_at: string;
}

export interface MembershipLog {
  id: string;
  action: string;
  points_change: number;
  created_at: string;
  description: string;
}
```

### Stock Types (New)
```typescript
export interface StockItem {
  id: string;
  catalog_name: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
}
```

### Profile & Outlet Types (New/Updated)
```typescript
export interface ProfileUpdatePayload {
  name: string;
  password?: string;
  confirm_password?: string;
}

export interface OutletUpdatePayload {
  service_charges: number;
}
```

---

## Recommendations
1. **API Service Refactoring**: Update `catalogApi` segera untuk menghindari error integrasi.
2. **New Service Scaffolding**: Buat file API baru untuk `membership`, `stock`, `profile`, dan `outlet`.
3. **Type Centralization**: Tambahkan file-file tipe baru di `src/services/types/`.

---
*Research alignment completed with SDD 2.0*
