# Research: API Implementation Compliance Audit

**Task ID:** api-compliance
**Date:** 2026-07-08
**Status:** Complete

---

## Executive Summary

This audit compares the existing **frontend React SPA** (franchisee-v2) API integration layer against the backend API contract (`api-contract-franchise.md`) and implementation spec (`spec-franchise.md`). The project is a **React 19 + TypeScript + RTK Query SPA** consuming a Go backend at `https://api.onward.co.id/franchise`.

**Key finding:** The frontend covers ~70% of required endpoints but has significant type/payload misalignment, missing services, and pagination param inconsistencies (`limit` vs `page_size`). Two whole service modules are missing: `payment-method` and `outlet-topup-request`. DTOs across auth, profile, user, membership, and withdrawal need alignment with the contract.

---

## Project Architecture

| Layer | Current Implementation |
|-------|----------------------|
| **Language** | TypeScript 6.0 |
| **Framework** | React 19 + Vite 8 |
| **State** | Redux Toolkit 2.11 + RTK Query + redux-persist |
| **API Layer** | RTK Query `createApi` with `fetchBaseQuery` |
| **Base URL** | `https://api.onward.co.id/franchise` |
| **Auth** | Bearer token injected via `prepareHeaders`, stored in Redux slice + localStorage |
| **Pagination** | Custom `useTable` hook sending `page`, `limit`, `search` |
| **Validation** | Manual in components (no schema validation library) |
| **Types** | Manual TS interfaces in `src/services/types/` |
| **Controllers** | React pages consume RTK Query hooks |
| **Error handling** | `failureWithTimeout` from form slice, auth error detection → auto signout |

### Architecture Pattern

```
Pages (React)
  → Hooks (useTable, useAuth, createCrudHook)
    → RTK Query APIs (createApi)
      → baseQuery (fetchBaseQuery wrapper)
        → Go Backend (api.onward.co.id/franchise)
```

---

## API Compliance Matrix

| # | Endpoint | Method | Contract | Current Implementation | Status | Action |
|---|----------|--------|----------|----------------------|--------|--------|
| 1 | `/auth/login` | POST | phone+password, return token+user+outlet | Sends `identifier`+`password`, expects `{user,token}` | **Partial** | Fix login DTO to use `phone`, fix response parsing |
| 2 | `/profile/me` | GET | Return user+outlet profile | `useLazyGetProfileQuery` exists, type `UserProfile` mismatched | **Partial** | Fix response type to match contract |
| 3 | `/profile/me` | PUT | Update display_name, phone, email | `useUpdateProfileMutation` exists, payload `ProfileUpdatePayload` mismatched | **Partial** | Fix DTO to use `display_name`, `phone`, `email` |
| 4 | `/outlet` | PUT | Update service_charges, name, address | `useUpdateOutletMutation` exists, payload matches partially | **Partial** | Rename `service_charges` → `service_charge` per spec |
| 5 | `/outlet/balance/log` | GET | Paginated, date-filtered balance log | `useLazyGetLogQuery` exists | **OK** | Verify response type |
| 6 | `/catalog-outlet` | GET | Paginated, search, status filter | `useLazyGetCatalogQuery` exists | **OK** | Verify response type |
| 7 | `/catalog-outlet/{id}` | GET | Detail with fractions | **Missing** | **Missing** | Add endpoint |
| 8 | `/catalog-outlet/{id}` | PUT | Update min_stock, max_stock | `useUpdateCatalogMutation` exists | **OK** | |
| 9 | `/catalog-outlet/{id}/activate` | PUT | Activate catalog | `useActivateCatalogMutation` exists | **OK** | |
| 10 | `/catalog-outlet/{id}/deactivate` | PUT | Deactivate catalog | `useDeactivateCatalogMutation` exists | **OK** | |
| 11 | `/stock` | GET | Paginated, catalog_id filter, search | `useLazyGetStockQuery` exists | **OK** | Verify response type matches contract |
| 12 | `/stock/log` | GET | Paginated, date+type filter | `useLazyGetStockLogsQuery` exists | **OK** | Verify response type |
| 13 | `/user` | GET | Paginated, status filter, search | `useLazyGetUserQuery` exists | **OK** | Verify response type |
| 14 | `/user` | POST | Create cashier (display_name, phone, password) | `useCreateUserMutation` exists | **Partial** | Fix DTO to use `display_name`, `phone` |
| 15 | `/user/{id}` | GET | Cashier detail | `useLazyShowUserQuery` exists | **OK** | |
| 16 | `/user/{id}` | PUT | Update cashier | `useUpdateUserMutation` exists | **OK** | Fix DTO to match contract fields |
| 17 | `/user/{id}` | DELETE | Soft-delete | `useRemoveUserMutation` exists | **OK** | |
| 18 | `/membership` | GET | Paginated, search by name/phone/card | `useLazyGetMembershipQuery` exists | **OK** | Fix response type to match contract |
| 19 | `/membership/{id}` | GET | Member detail | `useLazyShowMembershipQuery` exists | **OK** | |
| 20 | `/membership/{id}/log` | GET | Balance history | `useLazyGetMembershipLogsQuery` exists | **OK** | |
| 21 | `/sales/session` | GET | Paginated, date filter | `useLazyGetSessionQuery` exists | **OK** | |
| 22 | `/sales/session/{id}` | GET | Session detail | `useLazyShowSessionQuery` exists | **OK** | |
| 23 | `/sales/order/{id}` | GET | Order detail with items | `useLazyShowOrderQuery` exists | **OK** | |
| 24 | `/payment-method` | GET | List payment methods | **Missing** | **Missing** | Add service |
| 25 | `/withdrawal-request` | GET | Paginated, status filter | `useLazyGetListQuery` exists | **OK** | |
| 26 | `/withdrawal-request/{id}` | GET | Detail | **Missing** | **Missing** | Add endpoint |
| 27 | `/withdrawal-request` | POST | Create (amount, bank_name, account_number, account_name, notes) | `useCreateMutation` exists | **Partial** | Fix DTO field names |
| 28 | `/withdrawal-request/{id}/cancel` | PUT | Cancel pending | `useCancelMutation` exists | **OK** | |
| 29 | `/outlet-topup-request` | GET | List paginated, status filter | **Missing** | **Missing** | Add service |
| 30 | `/outlet-topup-request/{id}` | GET | Detail | **Missing** | **Missing** | Add service |
| 31 | `/outlet-topup-request` | POST | Create (amount, notes) | **Missing** | **Missing** | Add service |
| 32 | `/outlet-topup-request/{id}` | DELETE | Cancel | **Missing** | **Missing** | Add service |
| 33 | `/dashboard` | GET | Period filter, return sales/orders/balance/members/lowstock/pending | `useLazyGetDashboardQuery` exists | **Partial** | Fix response type to match contract |
| 34 | `/report/cash-control` | GET | Paginated, date filter | `useLazyGetCashControlQuery` exists | **OK** | |
| 35 | `/report/cash-control/summary` | GET | Summary | `useLazyGetCashControlSummaryQuery` exists | **OK** | |
| 36 | `/report/outstanding` | GET | Paginated, type filter | `useLazyGetOutstandingQuery` exists | **OK** | |
| 37 | `/report/outstanding/summary` | GET | Summary | `useLazyGetOutstandingSummaryQuery` exists | **OK** | |
| 38 | `/report/settlement` | GET | Paginated, date filter | `useLazyGetSettlementQuery` exists | **OK** | |
| 39 | `/report/settlement/summary` | GET | Summary | `useLazyGetSettlementSummaryQuery` exists | **OK** | |
| 40 | `/report/product-sales` | GET | Paginated, date+catalog filter | `useLazyGetProductSalesQuery` exists | **OK** | |
| 41 | `/report/product-sales/summary` | GET | Summary | `useLazyGetProductSalesSummaryQuery` exists | **OK** | |

### Summary Stats

| Status | Count |
|--------|-------|
| **OK** | 23 |
| **Partial** | 6 |
| **Missing** | 12 (3 services × 4 endpoints = 12, but effectively 2 full services + 3 individual endpoints) |
| **Total** | 41 |

---

## Entity/Type Mismatches

### Auth Types (`src/services/types/auth.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `phone` (login) | `identifier` | Field name mismatch |
| `token` | `token` | OK, but contract returns `token` at top level + inside `data` |
| `user.display_name` | `user.name` | Field name mismatch |
| `user.role` | `user.is_supervisor` | Different paradigms |
| `outlet` object | Not stored in type | Missing outlet in auth response type |

### Outlet Types (`src/services/types/outlet.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `service_charge` (singular) | `service_charges` (plural) | Field name mismatch |
| Missing `address`, `outlet_type_id`, `brand_id` | Not present | Incomplete type |

### Catalog Types (`src/services/types/catalog.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `CatalogOutlet` has nested `catalog`+`outlet` | Contract flattens with `catalog_name`, `category_name`, `stock` | Structural mismatch |
| Missing `CatalogOutletDetail` type with `fractions` | Not present | Missing type |

### User Types (`src/services/types/user.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `display_name` | `name` | Field name mismatch |
| `phone` | `username` | Semantic mismatch |
| `role: "cashier"` | `is_supervisor: boolean` | Different structure |

### Membership Types (`src/services/types/membership.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `member_name` | `name` | Field name mismatch |
| `card_number` | `card_id` | Different concept |
| `balance` | `saldo` | Field name mismatch |
| `phone`, `email`, `point` | Not present | Incomplete type |

### Stock Types (`src/services/types/stock.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| Stock uses `Ingredient` model | Contract uses `Catalog` model | Different domain entity |
| `StockLog` references `ingredient` | Contract references `catalog` | Entity mismatch |

### Withdrawal Types (`src/services/types/withdrawal.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `bank_name`, `account_number`, `account_name` | Not present | Missing fields |
| `note` | `description` | Field name mismatch |
| Missing `notes` field | Not present | Incomplete |

### Dashboard Types (`src/services/types/dashboard.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `total_sales_today`, `total_orders_today` | `omzet_hari_ini`, `total_transaksi` | Different naming convention |
| `outlet_balance` | `saldo_outlet` | Field name mismatch |
| `total_members` | Not present | Missing field |
| `low_stock_items` | `stok_kritis` | Field name mismatch |
| `pending_withdrawal` | Not present | Missing field |
| `pending_topup` | Not present | Missing field |

### Profile Types (`src/services/types/profile.ts`)

| Contract Field | Current Type | Issue |
|---------------|-------------|-------|
| `display_name` | `name` | Field name mismatch |
| `phone` | `identifier` | Field name mismatch |
| Missing `email`, `outlet` object | Not present | Incomplete |

---

## Pagination Param Alignment

| Contract Param | Current Implementation | Issue |
|---------------|----------------------|-------|
| `page_size` | `limit` | Param name mismatch |
| `page` | `page` | OK |
| `q` (search) | `search` | Param name mismatch |

**Root cause:** `src/services/table/api.tsx` sends `{ page, limit, search }`. Contract expects `{ page, page_size, q }`.

---

## Response Format Alignment

| Contract | Current Handling | Issue |
|----------|-----------------|-------|
| `{ success, message, data }` | Checks `res?.message === "success"` | OK |
| `meta: { page, page_size, total, total_pages, has_next, has_prev }` | `meta: { total }` + checks `meta.total` | `page_size` vs `limit` in meta |
| `{ success: false, message, errors }` | Error shape from `ApiError` type | OK |
| `{ data: [...] }` array | Checks `Array.isArray(res?.data)` | OK |

---

## Missing Service Modules

### 1. `payment-method` — GET /payment-method
- No API service file
- No type definitions
- No hook

### 2. `outlet-topup-request` — CRUD /outlet-topup-request
- No API service file
- No type definitions
- No hook

### 3. Individual missing endpoints
- `GET /catalog-outlet/{id}` — detail with fractions
- `GET /withdrawal-request/{id}` — withdrawal detail

---

## Current Patterns to Preserve

1. **RTK Query `createApi` pattern** — Each domain has `api.tsx` with `createApi({ reducerPath, baseQuery, endpoints })`
2. **`baseQuery` wrapper** — Handles auth headers, error handling, file downloads
3. **Separate types** — Types in `src/services/types/` exported via `index.ts`
4. **Custom hooks** — Either `createCrudHook` factory or custom `useXxx` hooks
5. **Table hook pattern** — `useTable` for list pages with pagination, sorting, filtering
6. **Auth flow** — Bearer token → Redux slice → persist → baseQuery `prepareHeaders`
7. **Error handling** — `failureWithTimeout` from form slice for mutation errors

---

## Recommendations

### High Priority (Functional Gaps)
1. **Add `payment-method` service** — GET /payment-method, types, hook
2. **Add `outlet-topup-request` service** — Full CRUD, types, hooks
3. **Add `GET /catalog-outlet/{id}`** — Detail endpoint
4. **Add `GET /withdrawal-request/{id}`** — Detail endpoint

### Medium Priority (Correctness)
5. **Fix auth** — Change `identifier` → `phone`, update response parsing for `data.user` + `data.outlet`
6. **Fix pagination params** — Align `useTable` to send `page_size` and `q` instead of `limit` and `search`
7. **Fix profile DTOs** — Align with contract `display_name`, `phone`, `email`
8. **Fix user DTOs** — Align create/update with contract
9. **Fix withdrawal DTOs** — Align create request with contract fields

### Low Priority (Cleanup)
10. **Align type definitions** — All entity types to match contract field names
11. **Update dashboard types** — Use contract field naming
12. **Update membership types** — Use contract field naming

---

## Open Questions

- Should `useTable` be modified to send `page_size`/`q` or should an adapter layer be added? skip for now
- Does the backend return `{ success, message, data }` format or does the frontend need to handle different response shapes per endpoint? no need
- Should existing page components be updated to use new field names from aligned types? yes, and keep the old one if in case the new is not working.

---

## Next Steps

1. Review this research document
2. Proceed to implementation planning with `/plan api-compliance`
3. Execute missing service modules first, then DTO alignment, then type fixes

---

*Research completed with SDD 2.0*
