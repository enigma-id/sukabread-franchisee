# Implementation Todo-List: Franchise API Alignment

**Task ID:** api-synchronization
**Started:** 2026-06-04
**Status:** Complete

## Progress Tracker

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Types & Interfaces Definition | Complete |
| **Phase 2** | Existing API Alignment | Complete |
| **Phase 3** | New Service Implementations | Complete |
| **Phase 4** | Store Integration & Verification | Complete |

---

## Detailed Checklist

### Phase 1: Types & Interfaces Definition
- [x] Task 1.1: Align Auth `LoginRequest` (`username` -> `identifier`) in `src/services/types/auth.ts`
- [x] Task 1.2: Add `CatalogUpdatePayload` in `src/services/types/catalog.ts`
- [x] Task 1.3: Create `src/services/types/membership.ts`
- [x] Task 1.4: Create `src/services/types/stock.ts`
- [x] Task 1.5: Create `src/services/types/profile.ts`
- [x] Task 1.6: Create `src/services/types/outlet.ts`
- [x] Task 1.7: Re-export new types in `src/services/types/index.ts`

### Phase 2: Existing API Alignment
- [x] Task 2.1: Update `src/services/auth/api.tsx` to target `/auth/login` (post/body payload uses `identifier`)
- [x] Task 2.2: Correct `src/services/catalog/api.tsx` paths (`/activate` and `/deactivate`)

### Phase 3: New Service Implementations
- [x] Task 3.1: Create `profileApi` (`api.tsx` & `hooks.tsx`) in `src/services/profile/`
- [x] Task 3.2: Create `outletApi` (`api.tsx` & `hooks.tsx`) in `src/services/outlet/`
- [x] Task 3.3: Create `membershipApi` (`api.tsx` & `hooks.tsx`) in `src/services/membership/`
- [x] Task 3.4: Create `stockApi` (`api.tsx` & `hooks.tsx`) in `src/services/stock/`

### Phase 4: Store Integration & Verification
- [x] Task 4.1: Integrate new APIs into `src/services/reducer.tsx`
- [x] Task 4.2: Integrate middleware and reducers in `src/services/store.tsx`
- [x] Task 4.3: Run typecheck check `npx tsc --noEmit` and confirm zero errors

---
*Generated with SDD 4.0*
