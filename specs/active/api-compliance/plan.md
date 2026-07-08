# Technical Plan: API Compliance Implementation

**Task ID:** api-compliance
**Status:** Ready for Implementation
**Based on:** research.md, api-contract-franchise.md, spec-franchise.md

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Pages (React)                     │
│  Login | Dashboard | Settings | Reports | ...        │
└──────────┬──────────────────────────────────────────┘
           │ consumes
┌──────────▼──────────────────────────────────────────┐
│                 Custom Hooks                          │
│  useAuth  |  useTable  |  createCrudHook             │
└──────────┬──────────────────────────────────────────┘
           │ calls
┌──────────▼──────────────────────────────────────────┐
│              RTK Query API Services                   │
│  createApi({ reducerPath, baseQuery, endpoints })    │
│  auth | profile | outlet | catalog | stock | user    │
│  membership | sales | withdrawal | dashboard | report │
│  ► payment-method (NEW)                               │
│  ► outlet-topup-request (NEW)                         │
└──────────┬──────────────────────────────────────────┘
           │ wrapped by
┌──────────▼──────────────────────────────────────────┐
│              baseQuery (fetchBaseQuery)               │
│  Auth headers | Error handling | File download       │
└──────────┬──────────────────────────────────────────┘
           │ HTTP
┌──────────▼──────────────────────────────────────────┐
│         Go Backend (api.onward.co.id/franchise)       │
└─────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Type alignment | New contract types + old types as fallback | `keep the old one if new is not working` |
| Missing services | Create new `api.tsx` + types per existing pattern | Preserve architecture |
| Missing endpoints | Add to existing API service | One service per domain |
| Pagination params | Skip for now | Explicitly noted |
| DTO fixes | Update existing interfaces with contract fields | Align with backend |

---

## 2. Technology Stack

No new dependencies required. All work within existing stack:

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| API Layer | RTK Query `createApi` | Existing pattern, preserve |
| Base Query | `fetchBaseQuery` wrapper | Existing, handles auth |
| Types | Manual TS interfaces | Existing pattern |
| State | Redux Toolkit slices | Existing |

---

## 3. Component Design

### 3.1 New Service: Payment Method

**Purpose:** Fetch payment methods available for franchise

**Location:** `src/services/payment-method/api.tsx`

**Endpoints:**
- `GET /payment-method` → `getPaymentMethod` query

**Type location:** `src/services/types/payment-method.ts`

**Export:** Add to `src/services/types/index.ts`, add reducer to `src/services/reducer.tsx`, add to persist blacklist in `src/services/store.tsx`

**Pattern:** Follow existing simple GET-only services (no hooks file needed if consumed via `createCrudHook`)

### 3.2 New Service: Outlet Topup Request

**Purpose:** Manage outlet saldo topup requests (CRUD)

**Location:** `src/services/outlet-topup/api.tsx`

**Endpoints:**
- `GET /outlet-topup-request` → `getList` query
- `GET /outlet-topup-request/{id}` → `show` query
- `POST /outlet-topup-request` → `create` mutation
- `DELETE /outlet-topup-request/{id}` → `remove` mutation

**Type location:** `src/services/types/outlet-topup.ts`

**Export:** Same pattern as payment-method

### 3.3 Missing Endpoint: Catalog Outlet Detail

**Add to** `src/services/catalog/api.tsx`

- `GET /catalog-outlet/{id}` → `showCatalog` query

### 3.4 Missing Endpoint: Withdrawal Detail

**Add to** `src/services/withdrawal/api.tsx`

- `GET /withdrawal-request/{id}` → `show` query

---

## 4. Data Model — Type Definitions

### 4.1 Auth Types — Updated

```typescript
// Keep existing types for backward compat
export interface AuthUser extends User { token?: string } // keep
export interface LoginRequest { identifier: string; password: string } // keep

// New contract-aligned types
export interface ContractLoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: string;
    display_name: string;
    phone: string;
    role: string; // "outlet_owner" | "cashier"
  };
  outlet: {
    id: string;
    name: string;
    outlet_type_id: string;
    brand_id: string;
  };
}
```

### 4.2 Profile Types — Updated

```typescript
// Keep existing for backward compat
export interface UserProfile { id: number; name: string; identifier: string; ... }

// New contract-aligned types
export interface ContractProfile {
  id: string;
  display_name: string;
  phone: string;
  email: string;
  role: string;
  outlet: {
    id: string;
    name: string;
    address: string;
    outlet_type_id: string;
  };
}

export interface ContractProfileUpdatePayload {
  display_name?: string;
  phone?: string;
  email?: string;
}
```

### 4.3 Outlet Types — Updated

```typescript
// Keep existing
export interface Outlet { id: string; name: string; service_charges: number; }

// New contract-aligned
export interface ContractOutletUpdatePayload {
  service_charge?: number;
  name?: string;
  address?: string;
}

export interface ContractBalanceLog {
  id: string;
  outlet_id: string;
  type: "topup" | "withdrawal" | "payment";
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  created_at: string;
}
```

### 4.4 User Types — Updated

```typescript
// Keep existing
export interface ManagedUser { ... }
export interface CreateUserRequest { name: string; username: string; ... }

// New contract-aligned
export interface ContractCreateUserRequest {
  display_name: string;
  phone: string;
  password: string;
}
export interface ContractUpdateUserRequest {
  display_name?: string;
  phone?: string;
  password?: string;
  is_active?: boolean;
}
```

### 4.5 Withdrawal Types — Updated

```typescript
// Keep existing
export interface WithdrawalRequest { ... }

// New contract-aligned
export interface ContractCreateWithdrawalRequest {
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  notes?: string;
}
```

### 4.6 Membership Types — Updated

```typescript
// Keep existing
export interface Membership { ... }

// New contract-aligned
export interface ContractMembership {
  id: string;
  card_number: string;
  member_name: string;
  phone: string;
  balance: number;
  point: number;
  is_active: boolean;
  created_at: string;
}

export interface ContractMembershipDetail {
  id: string;
  card_number: string;
  member_name: string;
  phone: string;
  email: string;
  balance: number;
  point: number;
  is_active: boolean;
  created_at: string;
}

export interface ContractMembershipLog {
  id: string;
  type: "topup" | "payment" | "refund";
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  created_at: string;
}
```

### 4.7 Stock Types — Updated

```typescript
// New contract-aligned
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
```

### 4.8 Dashboard Types — Updated

```typescript
// New contract-aligned
export interface ContractDashboard {
  total_sales_today: number;
  total_orders_today: number;
  outlet_balance: number;
  total_members: number;
  low_stock_items: number;
  pending_withdrawal: number;
  pending_topup: number;
}
```

### 4.9 Payment Method Type

```typescript
export interface ContractPaymentMethod {
  id: string;
  name: string;
  provider: "saldo" | "midtrans" | "xendit";
  is_active: boolean;
}
```

### 4.10 Outlet Topup Type

```typescript
export interface ContractOutletTopup {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "completed";
  note?: string;
  created_at: string;
}

export interface ContractCreateTopupRequest {
  amount: number;
  note?: string;
}
```

### 4.11 Catalog Types — Detail Type

```typescript
export interface CatalogOutletDetail {
  id: string;
  catalog_id: string;
  catalog_name: string;
  description: string;
  category_name: string;
  min_stock: number;
  max_stock: number;
  base_price: number;
  is_active: boolean;
  stock: number;
  fractions: Array<{
    id: string;
    name: string;
    value: number;
  }>;
}
```

---

## 5. Implementation Phases

### Phase 1: New Service — Payment Method

**Files to create:**
- `src/services/types/payment-method.ts`
- `src/services/payment-method/api.tsx`

**Files to modify:**
- `src/services/types/index.ts` — add export
- `src/services/reducer.tsx` — add reducer + middleware
- `src/services/store.tsx` — add to blacklist

### Phase 2: New Service — Outlet Topup Request

**Files to create:**
- `src/services/types/outlet-topup.ts`
- `src/services/outlet-topup/api.tsx`

**Files to modify:**
- `src/services/types/index.ts` — add export
- `src/services/reducer.tsx` — add reducer + middleware
- `src/services/store.tsx` — add to blacklist

### Phase 3: Missing Endpoints

**Files to modify:**
- `src/services/catalog/api.tsx` — add `showCatalog` query (GET /catalog-outlet/{id})
- `src/services/withdrawal/api.tsx` — add `show` query (GET /withdrawal-request/{id})

### Phase 4: Type Definitions — Add Contract-Aligned Types

**Files to create/modify:**
- `src/services/types/auth.ts` — add `ContractLoginRequest`, `LoginResponseData`
- `src/services/types/profile.ts` — add `ContractProfile`, `ContractProfileUpdatePayload`
- `src/services/types/outlet.ts` — add `ContractOutletUpdatePayload`, `ContractBalanceLog`
- `src/services/types/user.ts` — add `ContractCreateUserRequest`, `ContractUpdateUserRequest`
- `src/services/types/withdrawal.ts` — add `ContractCreateWithdrawalRequest`
- `src/services/types/membership.ts` — add `ContractMembership`, `ContractMembershipDetail`, `ContractMembershipLog`
- `src/services/types/stock.ts` — add `ContractStockItem`, `ContractStockLog`
- `src/services/types/dashboard.ts` — add `ContractDashboard`
- `src/services/types/catalog.ts` — add `CatalogOutletDetail`
- `src/services/types/payment-method.ts` — `ContractPaymentMethod`
- `src/services/types/outlet-topup.ts` — `ContractOutletTopup`, `ContractCreateTopupRequest`

### Phase 5: DTO Alignment — API Services

**Files to modify:**
- `src/services/auth/api.tsx` — align login mutation to use `phone` field
- `src/services/profile/api.tsx` — align update profile payload
- `src/services/outlet/api.tsx` — align outlet update payload
- `src/services/user/api.tsx` — align create/update payloads
- `src/services/withdrawal/api.tsx` — align create payload

### Phase 6: Auth Slice Update

**Files to modify:**
- `src/services/auth/slice.tsx` — update session type to include `outlet`
- `src/services/auth/hooks.tsx` — align signin response parsing for `data.user` + `data.outlet`

---

## 6. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Backend doesn't return exact contract format | Medium | Low | Keep old field handling as fallback |
| New contract types break existing pages | Medium | Medium | Keep old types intact alongside new ones |
| Missing backend endpoint for new services | Medium | Low | Services are frontend-only; endpoint existence is backend responsibility |
| Import collisions between old/new types | Low | Low | Import with aliases where needed |

---

## 7. Open Questions

Resolved from research feedback:
- Pagination alignment: **skipped for now**
- Response format: **no changes needed**
- Old types: **keep alongside new types** for backward compatibility

---

## Next Steps

1. Review this technical plan
2. Run `/tasks api-compliance` to generate granular task breakdown
3. Run `/implement api-compliance` to start building

---

*Plan created with SDD 2.0*
