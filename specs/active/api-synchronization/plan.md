# Technical Plan: Franchise API Services & Types Synchronization

**Task ID:** api-synchronization
**Status:** Ready for Implementation
**Based on:** specs/active/api-synchronization/spec.md

---

## 1. System Architecture

The frontend uses Redux Toolkit (RTK) Query to communicate with the backend. We will update the services and type mappings to ensure compatibility with the updated backend schema.

### Architectural Decisions

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Service Separation** | Discrete RTK slices per domain | Keeps code modular and fits the codebase pattern. Each module has its own `/api.tsx`, `/hooks.tsx`, and types. |
| **Auth Migration** | Move profile management to `profileApi` | Aligns with the backend separating token authentication (`/auth`) from user-centric resources (`/profile`). |
| **Tags / Caching** | Introduce tag invalidations | `providesTags` on GET endpoints and `invalidatesTags` on PUT mutations ensures the UI updates instantly without manual reloading. |
| **CRUD Hooks Pattern**| Maintain `createCrudHook` pattern | Matches existing codebase helper (`src/services/hooks/createCrudHook.ts`) for standard CRUD operations. |

---

## 2. Technology Stack

- **Framework:** React with TypeScript.
- **State Management & Data Fetching:** Redux Toolkit & RTK Query.
- **Network Client:** Custom `baseQuery` wrapping fetch (automatically handles Bearer tokens).

---

## 3. Component & Service Design

We will modify or create the following files:

### A. Auth Service (`src/services/auth/api.tsx`)
- **Updates:** Update `/auth/signin` endpoint to `/auth/login` and payload keys.
- **Payload:** `LoginRequest` using `identifier` instead of `username`.

### B. Catalog Service (`src/services/catalog/api.tsx`)
- **Updates:** Correct the PUT paths for activation and deactivation.
- **Endpoints:**
  - `activateCatalog` -> `PUT /catalog-outlet/:id/activate`
  - `deactivateCatalog` -> `PUT /catalog-outlet/:id/deactivate`

### C. Profile Service (`src/services/profile/api.tsx` - New)
- **Purpose:** Handle user profile fetching and updates.
- **Endpoints:**
  - `getProfile` -> `GET /profile/me` (provides tag `"Profile"`)
  - `updateProfile` -> `PUT /profile/me` (invalidates tag `"Profile"`)

### D. Membership Service (`src/services/membership/api.tsx` - New)
- **Purpose:** Read-only operations for customer memberships.
- **Endpoints:**
  - `getMembership` -> `GET /membership` (provides tag `"Membership"`)
  - `showMembership` -> `GET /membership/:id` (provides tag `"Membership"`)
  - `getMembershipLogs` -> `GET /membership/:id/log` (provides tag `"MembershipLog"`)

### E. Stock Service (`src/services/stock/api.tsx` - New)
- **Purpose:** Read-only stock inventory and adjustment logs.
- **Endpoints:**
  - `getStock` -> `GET /stock` (provides tag `"Stock"`)
  - `getStockLogs` -> `GET /stock/log` (provides tag `"StockLog"`)

### F. Outlet Service (`src/services/outlet/api.tsx` - New)
- **Purpose:** Update outlet operational config.
- **Endpoints:**
  - `updateOutlet` -> `PUT /outlet` (invalidates tag `"Outlet"`)

---

## 4. Data Model & TypeScript Interfaces

### `src/services/types/auth.ts`
```typescript
export interface LoginRequest {
  identifier: string; // updated from username
  password: string;
}
```

### `src/services/types/catalog.ts`
```typescript
export interface CatalogUpdatePayload {
  min_stock: number;
  max_stock: number;
}
```

### `src/services/types/membership.ts` (New)
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

### `src/services/types/stock.ts` (New)
```typescript
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
  action: string; // e.g. "IN", "OUT", "ADJUST"
  quantity: number;
  previous_stock: number;
  current_stock: number;
  created_at: string;
  notes?: string;
}
```

### `src/services/types/outlet.ts` (New)
```typescript
export interface Outlet {
  id: string;
  name: string;
  service_charges: number;
}

export interface OutletUpdatePayload {
  service_charges: number;
}
```

### `src/services/types/profile.ts` (New)
```typescript
export interface UserProfile {
  id: string;
  name: string;
  identifier: string;
  role: string;
  is_active: boolean;
}

export interface ProfileUpdatePayload {
  name: string;
  password?: string;
  confirm_password?: string;
}
```

---

## 5. Security & Error Handling

- **Authorization:** All new endpoints (except `/auth/login`) must inherit the base query which automatically appends `Authorization: Bearer {{token}}` to requests.
- **Client Validation:** Enforce typing in payload interfaces to guarantee that values like `service_charges`, `min_stock`, and `max_stock` are checked as numbers before compile/execution.

---

## 6. Implementation Phases

- [ ] **Phase 1: Shared Redux Reducer & Store Configuration**
  - Register new RTK Query slices in `src/services/store.tsx` and `reducer.tsx`.
- [ ] **Phase 2: Types Definition**
  - Create and update `.ts` files inside `src/services/types/` for all payloads and responses.
- [ ] **Phase 3: Existing Service Alignment**
  - Update `authApi` login credentials payloads & path.
  - Update `catalogApi` active/deactive PUT endpoints.
- [ ] **Phase 4: New Service Slices & Hooks**
  - Implement `profileApi`, `membershipApi`, `stockApi`, and `outletApi` using the baseQuery helper.
  - Export query/mutation hooks.
- [ ] **Phase 5: Type-checking & Build Verification**
  - Run type checking tool to ensure there are no linter/compile regressions.

---

## 7. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
| :--- | :--- | :--- | :--- |
| **Breaking UI components using login** | High | Medium | Check references of `useLoginMutation` and ensure any fields mapping `username` are changed to `identifier`. |
| **API Path 404s** | High | Low | Double-check every path matches the exact string in `Franchise.postman_collection.json`. |
| **Tag Cache Conflicts** | Medium | Low | Ensure unique `tagTypes` and `reducerPath` names for the new services in Redux store. |

---

## Next Steps
- Verify technical plan approval.
- Run `/tasks api-synchronization` to generate granular tasks.
- Proceed to `/implement api-synchronization`.

---
*Technical Plan created with SDD 4.0*
