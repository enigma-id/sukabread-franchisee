# Research: API Collection Alignment & Type Mapping

**Task ID:** outlet-catalog-management
**Date:** 2026-06-04
**Status:** Complete

---

## Executive Summary

This research aligns the current frontend implementation with the latest `Franchise.postman_collection.json`. We identified critical path discrepancies in the Catalog module and several missing modules (Membership, Stock, Profile) that need implementation to support the franchisee operations fully.

The core architecture uses RTK Query and CRUD hooks. This document maps the backend contracts to the required frontend changes.

---

## API Comparison & Gap Analysis

### 1. Catalog Outlet (Critical Path Updates)
| Function | Existing Code Path | Postman Collection Path | Action |
| :--- | :--- | :--- | :--- |
| Activate | `/catalog-outlet/:id/active` | `/catalog-outlet/:id/activate` | **Update Required** |
| Deactivate | `/catalog-outlet/:id/deactive` | `/catalog-outlet/:id/deactivate` | **Update Required** |

### 2. New Modules (To be Implemented)
| Module | Endpoint | Method | Payload / Purpose |
| :--- | :--- | :--- | :--- |
| **Membership** | `/membership` | GET | List members |
| **Membership** | `/membership/:id` | GET | Member detail |
| **Membership** | `/membership/:id/log` | GET | Transaction logs |
| **Outlet** | `/outlet` | PUT | `{ service_charges: number }` |
| **Stock** | `/stock` | GET | Current inventory |
| **Stock** | `/stock/log` | GET | Stock movement history |
| **Profile** | `/profile/me` | GET | Current user data |
| **Profile** | `/profile/me` | PUT | Update name/password |

### 3. Auth Payload Changes
- **Auth Login**: Uses `identifier` instead of `username` (verified in Postman collection line 42).

---

## Codebase Analysis

### Existing Patterns
1. **Service Layer**: RTK Query slices located in `src/services/[module]/api.tsx`.
2. **Type Layer**: Centralized types in `src/services/types/[module].ts`.
3. **Consumption**: Custom hooks in `src/services/[module]/hooks.tsx` using `createCrudHook`.

---

## Proposed TypeScript Interfaces

### Catalog (Updated)
```typescript
// Path: src/services/types/catalog.ts
export interface CatalogUpdatePayload {
  min_stock: number;
  max_stock: number;
}
```

### Membership (New)
```typescript
// Path: src/services/types/membership.ts
export interface Membership {
  id: string;
  name: string;
  phone: string;
  points: number;
  joined_at: string;
}

export interface MembershipLog {
  id: string;
  action: string;
  points_change: number;
  created_at: string;
}
```

### Stock & Outlet (New)
```typescript
// Path: src/services/types/stock.ts
export interface StockItem {
  id: string;
  catalog_name: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
}

// Path: src/services/types/outlet.ts
export interface OutletUpdatePayload {
  service_charges: number;
}
```

---

## Recommendations

1. **Service Alignment**: Prioritize updating `catalogApi` paths to match the backend (activate/deactivate) to avoid 404 errors.
2. **Membership Implementation**: Create a new service for Membership as it's a key requirement for franchisee customer tracking.
3. **Stock Visibility**: Implement the Stock and Stock Log features to help outlet managers track inventory movement.
4. **Profile Management**: Update the profile service to allow managers to change their passwords and names.

---

## Next Steps

1. Run `/specify outlet-catalog-management` to detail functional requirements for these new endpoints.
2. Run `/plan outlet-catalog-management` to design the UI integration for Membership and Stock logs.

---
*Research completed with SDD 2.0*
