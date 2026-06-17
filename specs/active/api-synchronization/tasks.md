# Implementation Tasks: Franchise API Services & Types Synchronization

**Task ID:** api-synchronization
**Created:** 2026-06-04
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 7 |
| Estimated Effort | 14 hours |
| Phases | 4 |

---

## Phase 1: Types & Interfaces Definition

**Goal:** Establish type-safe models matching backend schemas.

### Task 1.1: Align Auth Types & Define Catalog Update Payload
- **Description:** Update `src/services/types/auth.ts` to replace `username` with `identifier` in `LoginRequest`. Add `CatalogUpdatePayload` interface to `src/services/types/catalog.ts`.
- **Acceptance Criteria:**
  - `LoginRequest` uses `identifier: string` instead of `username: string`.
  - `CatalogUpdatePayload` contains `min_stock: number` and `max_stock: number`.
- **Effort:** 1.5 hours
- **Priority:** High
- **Dependencies:** None

### Task 1.2: Create Types for New Modules (Membership, Stock, Profile, Outlet)
- **Description:** Create new TypeScript interface files: `src/services/types/membership.ts`, `src/services/types/stock.ts`, `src/services/types/profile.ts`, and `src/services/types/outlet.ts`.
- **Acceptance Criteria:**
  - Interfaces match schemas for `Membership`, `MembershipLog`, `StockItem`, `StockLog`, `UserProfile`, `ProfileUpdatePayload`, and `OutletUpdatePayload` defined in `plan.md`.
  - Exports are gathered in `src/services/types/index.ts` if a re-export pattern is present.
- **Effort:** 2.5 hours
- **Priority:** High
- **Dependencies:** Task 1.1

---

## Phase 2: Existing API Alignment

**Goal:** Correct paths and parameters in existing RTK slices.

### Task 2.1: Update Auth Slice to use Identifier
- **Description:** Update `src/services/auth/api.tsx` to call `/auth/login` instead of `/auth/signin`, and use `identifier` in the query payload.
- **Acceptance Criteria:**
  - Login mutation query accepts `LoginRequest` credentials.
  - Endpoint targets `POST /auth/login`.
- **Effort:** 1.5 hours
- **Priority:** High
- **Dependencies:** Task 1.1

### Task 2.2: Correct Catalog Activation Paths
- **Description:** Update `src/services/catalog/api.tsx` activation and deactivation PUT paths.
- **Acceptance Criteria:**
  - `activateCatalog` mutation targets `PUT /catalog-outlet/:id/activate`.
  - `deactivateCatalog` mutation targets `PUT /catalog-outlet/:id/deactivate`.
- **Effort:** 1.5 hours
- **Priority:** High
- **Dependencies:** Task 1.1

---

## Phase 3: New Service Implementations

**Goal:** Scaffold new RTK Query slices and hooks.

### Task 3.1: Implement Profile & Outlet Services
- **Description:** Create `src/services/profile/api.tsx`, `src/services/profile/hooks.tsx`, `src/services/outlet/api.tsx`, and `src/services/outlet/hooks.tsx`.
- **Acceptance Criteria:**
  - Implement endpoints for `GET /profile/me`, `PUT /profile/me`, and `PUT /outlet`.
  - Hooks use `createCrudHook` wrapper.
- **Effort:** 2.5 hours
- **Priority:** Medium
- **Dependencies:** Task 1.2

### Task 3.2: Implement Membership & Stock Services
- **Description:** Create API slices and hooks for Membership (`/membership`, `/membership/:id`, `/membership/:id/log`) and Stock (`/stock`, `/stock/log`).
- **Acceptance Criteria:**
  - RTK Query slice definitions match target paths.
  - Hooks correctly query read-only data.
- **Effort:** 3 hours
- **Priority:** Medium
- **Dependencies:** Task 1.2

---

## Phase 4: Redux Store Integration & Validation

**Goal:** Integrate new slices into Redux and verify compile.

### Task 4.1: Integrate Slices into Store & Run Type Check
- **Description:** Register the new API reducers and middlewares in `src/services/store.tsx` and `src/services/reducer.tsx`. Run local check to ensure no build compile errors.
- **Acceptance Criteria:**
  - All new APIs are mounted properly in the Redux store.
  - Command `npm run build` or `npx tsc --noEmit` runs with zero compiler errors.
- **Effort:** 1.5 hours
- **Priority:** High
- **Dependencies:** Task 3.1, Task 3.2

---

## Quick Reference Checklist

- [ ] Task 1.1: Align Auth Types & Define Catalog Update Payload
- [ ] Task 1.2: Create Types for New Modules (Membership, Stock, Profile, Outlet)
- [ ] Task 2.1: Update Auth Slice to use Identifier
- [ ] Task 2.2: Correct Catalog Activation Paths
- [ ] Task 3.1: Implement Profile & Outlet Services
- [ ] Task 3.2: Implement Membership & Stock Services
- [ ] Task 4.1: Integrate Slices into Store & Run Type Check

---

## Next Steps

1. Review task list breakdown.
2. Run `/implement api-synchronization` to begin development.

---

*Tasks created with SDD 4.0*
