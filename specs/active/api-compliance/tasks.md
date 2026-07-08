# Implementation Tasks: API Compliance

**Task ID:** api-compliance
**Created:** 2026-07-08
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 18 |
| Estimated Effort | ~28 hours |
| Phases | 6 |

## Dependency Map

```
Phase 1 ─┐
Phase 2 ─┤
Phase 3 ─┤── (parallel) ──> all independent
Phase 4 ─┤
Phase 6 ─┘
           └── Phase 4 ──> Phase 5 (DTO alignment needs contract types)
```

## Phase 1: New Service — Payment Method

**Goal:** Fetch payment methods available for franchise via new RTK Query service

### Task 1.1: Create payment-method types

**Description:** Create `src/services/types/payment-method.ts` with `ContractPaymentMethod` interface (id, name, provider, is_active)

**Acceptance Criteria:**
- [ ] File created at `src/services/types/payment-method.ts`
- [ ] Exports `ContractPaymentMethod` with fields: id, name, provider ("saldo" | "midtrans" | "xendit"), is_active
- [ ] Import/export added to `src/services/types/index.ts`

**Effort:** 1 hour
**Priority:** High
**Dependencies:** None

---

### Task 1.2: Create payment-method API service

**Description:** Create `src/services/payment-method/api.tsx` with `getPaymentMethod` query (GET /payment-method)

**Acceptance Criteria:**
- [ ] File created at `src/services/payment-method/api.tsx`
- [ ] Uses `createApi` with `reducerPath: "paymentMethodApi"`
- [ ] `getPaymentMethod` query returns `ContractPaymentMethod[]`
- [ ] Follows existing simple GET-only service pattern

**Effort:** 1.5 hours
**Priority:** High
**Dependencies:** Task 1.1

---

### Task 1.3: Register payment-method service in store

**Description:** Add paymentMethodApi reducer + middleware to `src/services/reducer.tsx` and blacklist to `src/services/store.tsx`

**Acceptance Criteria:**
- [ ] Reducer added to `src/services/reducer.tsx`
- [ ] Middleware registered in store config
- [ ] API reducer added to persist blacklist in `src/services/store.tsx`
- [ ] Build passes with no errors

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 1.2

---

## Phase 2: New Service — Outlet Topup Request

**Goal:** Manage outlet saldo topup requests (CRUD) via new RTK Query service

### Task 2.1: Create outlet-topup types

**Description:** Create `src/services/types/outlet-topup.ts` with `ContractOutletTopup` and `ContractCreateTopupRequest`

**Acceptance Criteria:**
- [ ] File created at `src/services/types/outlet-topup.ts`
- [ ] `ContractOutletTopup`: id, amount, status (pending|approved|rejected|completed), note?, created_at
- [ ] `ContractCreateTopupRequest`: amount, note?
- [ ] Import/export added to `src/services/types/index.ts`

**Effort:** 1 hour
**Priority:** High
**Dependencies:** None

---

### Task 2.2: Create outlet-topup API service

**Description:** Create `src/services/outlet-topup/api.tsx` with CRUD endpoints: getList, show, create, remove

**Acceptance Criteria:**
- [ ] File created at `src/services/outlet-topup/api.tsx`
- [ ] `getList` query — GET /outlet-topup-request
- [ ] `show` query — GET /outlet-topup-request/{id}
- [ ] `create` mutation — POST /outlet-topup-request
- [ ] `remove` mutation — DELETE /outlet-topup-request/{id}
- [ ] Uses `createApi` with `reducerPath: "outletTopupApi"`

**Effort:** 2 hours
**Priority:** High
**Dependencies:** Task 2.1

---

### Task 2.3: Register outlet-topup service in store

**Description:** Add outletTopupApi reducer + middleware to reducer.tsx and blacklist to store.tsx

**Acceptance Criteria:**
- [ ] Reducer added to `src/services/reducer.tsx`
- [ ] Middleware registered in store config
- [ ] API reducer blacklisted in `src/services/store.tsx`
- [ ] Build passes

**Effort:** 0.5 hours
**Priority:** High
**Dependencies:** Task 2.2

---

## Phase 3: Missing Endpoints

**Goal:** Add individual missing endpoints to existing API services

### Task 3.1: Add catalog outlet detail endpoint

**Description:** Add `showCatalog` query to `src/services/catalog/api.tsx`: GET /catalog-outlet/{id}

**Acceptance Criteria:**
- [ ] `showCatalog` query added with `query: ({ id }) => /catalog-outlet/${id}`
- [ ] Returns `CatalogOutletDetail` type with fractions array
- [ ] Existing endpoints preserved

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** None

---

### Task 3.2: Add withdrawal detail endpoint

**Description:** Add `show` query to `src/services/withdrawal/api.tsx`: GET /withdrawal-request/{id}

**Acceptance Criteria:**
- [ ] `show` query added with `query: ({ id }) => /withdrawal-request/${id}`
- [ ] Existing endpoints preserved

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** None

---

## Phase 4: Type Definitions — Add Contract-Aligned Types

**Goal:** Add `Contract*` prefixed types alongside existing types for all domains

### Task 4.1: Add contract types for auth, profile, outlet

**Description:** Add contract-aligned types to auth.ts, profile.ts, outlet.ts

**Acceptance Criteria:**
- [ ] `src/services/types/auth.ts`: `ContractLoginRequest` (phone, password), `LoginResponseData` (token, user, outlet)
- [ ] `src/services/types/profile.ts`: `ContractProfile` (id, display_name, phone, email, role, outlet), `ContractProfileUpdatePayload` (display_name?, phone?, email?)
- [ ] `src/services/types/outlet.ts`: `ContractOutletUpdatePayload` (service_charge?, name?, address?), `ContractBalanceLog` (id, outlet_id, type, amount, balance_before, balance_after, reference, created_at)
- [ ] All existing types preserved

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.2: Add contract types for user, membership

**Description:** Add contract-aligned types to user.ts and membership.ts

**Acceptance Criteria:**
- [ ] `src/services/types/user.ts`: `ContractCreateUserRequest` (display_name, phone, password), `ContractUpdateUserRequest` (display_name?, phone?, password?, is_active?)
- [ ] `src/services/types/membership.ts`: `ContractMembership` (id, card_number, member_name, phone, balance, point, is_active, created_at), `ContractMembershipDetail`, `ContractMembershipLog`
- [ ] All existing types preserved

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.3: Add contract types for stock, dashboard, catalog

**Description:** Add contract-aligned types to stock.ts, dashboard.ts, catalog.ts

**Acceptance Criteria:**
- [ ] `src/services/types/stock.ts`: `ContractStockItem` (id, catalog_id, catalog_name, stock, min_stock, max_stock, fraction), `ContractStockLog` (id, catalog_id, catalog_name, type, quantity, stock_before, stock_after, reference, note, created_at)
- [ ] `src/services/types/dashboard.ts`: `ContractDashboard` (total_sales_today, total_orders_today, outlet_balance, total_members, low_stock_items, pending_withdrawal, pending_topup)
- [ ] `src/services/types/catalog.ts`: `CatalogOutletDetail` (id, catalog_id, catalog_name, description, category_name, min_stock, max_stock, base_price, is_active, stock, fractions[])
- [ ] All existing types preserved

**Effort:** 2 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 4.4: Add contract types for withdrawal, payment-method, outlet-topup

**Description:** Add contract-aligned types to withdrawal.ts and verify payment-method/outlet-topup types

**Acceptance Criteria:**
- [ ] `src/services/types/withdrawal.ts`: `ContractCreateWithdrawalRequest` (amount, bank_name, account_number, account_name, notes?)
- [ ] Existing types preserved

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** None (payment-method/outlet-topup types created in Phase 1/2)

---

## Phase 5: DTO Alignment — API Services

**Goal:** Align API service request payloads with contract field names

### Task 5.1: Align auth API service login payload

**Description:** Update `src/services/auth/api.tsx` login mutation to use `phone` field instead of `identifier`

**Acceptance Criteria:**
- [ ] Login mutation sends `{ phone, password }` instead of `{ identifier, password }`
- [ ] Existing login flow preserved
- [ ] No breaking changes to auth slice or hooks

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 4.1 (needs ContractLoginRequest type)

---

### Task 5.2: Align profile and outlet API services

**Description:** Update `src/services/profile/api.tsx` and `src/services/outlet/api.tsx` to use contract field names

**Acceptance Criteria:**
- [ ] Profile update sends `{ display_name?, phone?, email? }` instead of old payload
- [ ] Outlet update sends `{ service_charge? }` (singular) instead of `service_charges`
- [ ] All existing endpoints preserved

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 4.1

---

### Task 5.3: Align user API service payloads

**Description:** Update `src/services/user/api.tsx` create/update payloads to use `display_name`, `phone` instead of `name`, `username`

**Acceptance Criteria:**
- [ ] Create user sends `{ display_name, phone, password }` instead of `{ name, username, password }`
- [ ] Update user sends `{ display_name?, phone?, password?, is_active? }`
- [ ] All existing endpoints preserved

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 4.2

---

### Task 5.4: Align withdrawal API service payload

**Description:** Update `src/services/withdrawal/api.tsx` create payload to use `bank_name`, `account_number`, `account_name`, `notes`

**Acceptance Criteria:**
- [ ] Create withdrawal sends `{ amount, bank_name, account_number, account_name, notes? }`
- [ ] Old `description` field replaced with `notes`
- [ ] All existing endpoints preserved

**Effort:** 1 hour
**Priority:** Medium
**Dependencies:** Task 4.4

---

## Phase 6: Auth Slice Update

**Goal:** Update auth state types and response parsing to include `outlet` data

### Task 6.1: Update auth slice session type

**Description:** Update `src/services/auth/slice.tsx` to include `outlet` object in session type

**Acceptance Criteria:**
- [ ] `session` type updated to include `outlet: { id, name, outlet_type_id, brand_id } | null`
- [ ] `signin` action handles `outlet` payload
- [ ] Backward compatible — existing user data preserved

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** None

---

### Task 6.2: Align auth hooks for contract response

**Description:** Update `src/services/auth/hooks.tsx` to parse `data.user` + `data.outlet` from login response

**Acceptance Criteria:**
- [ ] `useAuth` hook dispatches both user and outlet from login response
- [ ] `res?.data.user` and `res?.data.outlet` parsed correctly
- [ ] Existing auth flow (token storage, signout) preserved
- [ ] No regressions in login flow

**Effort:** 1.5 hours
**Priority:** Medium
**Dependencies:** Task 6.1

---

## Quick Reference Checklist

- [ ] Task 1.1: Create payment-method types
- [ ] Task 1.2: Create payment-method API service
- [ ] Task 1.3: Register payment-method in store
- [ ] Task 2.1: Create outlet-topup types
- [ ] Task 2.2: Create outlet-topup API service
- [ ] Task 2.3: Register outlet-topup in store
- [ ] Task 3.1: Add catalog outlet detail endpoint
- [ ] Task 3.2: Add withdrawal detail endpoint
- [ ] Task 4.1: Contract types for auth, profile, outlet
- [ ] Task 4.2: Contract types for user, membership
- [ ] Task 4.3: Contract types for stock, dashboard, catalog
- [ ] Task 4.4: Contract types for withdrawal
- [ ] Task 5.1: Align auth API login payload
- [ ] Task 5.2: Align profile & outlet API services
- [ ] Task 5.3: Align user API service payloads
- [ ] Task 5.4: Align withdrawal API service payload
- [ ] Task 6.1: Update auth slice session type
- [ ] Task 6.2: Align auth hooks for contract response

## Next Steps

1. Review task breakdown
2. Run `/implement api-compliance` to start execution

---

*Tasks created with SDD 4.0*
