# Implementation Tasks: Outlet Catalog Management

**Task ID:** outlet-catalog-management
**Created:** 2026-06-03
**Status:** Ready for Implementation

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 7 |
| Estimated Effort | ~12 hours |
| Phases | 4 |

## Phase 1: Types & Service (3h)
**Goal:** Establish the foundation for catalog data communication.

### Task 1.1: Define Catalog Types
**Description:** Create `src/services/types/catalog.ts` with the `CatalogOutlet` interface.
**Effort:** 0.5h | **Priority:** High

### Task 1.2: Implement Catalog Service
**Description:** Create `src/services/catalog/api.tsx` and `hooks.tsx` using `createCrudHook`.
**Acceptance Criteria:**
- [ ] GET `/catalog-outlet` defined.
- [ ] PUT `/catalog-outlet/:id` defined.
- [ ] Activation/Deactivation endpoints defined.
**Effort:** 2.5h | **Priority:** High

## Phase 2: Table Configuration (3h)
**Goal:** Define how catalog data is rendered and managed in lists.

### Task 2.1: Create Table Config
**Description:** Create `src/pages/settings/table/catalog.config.tsx`.
**Acceptance Criteria:**
- [ ] Correct columns defined (Name, Stock, Status).
- [ ] Status toggle integrated with the hook.
- [ ] Action button to open edit modal.
**Effort:** 3h | **Priority:** Medium

## Phase 3: Main Page & Routing (2h)
**Goal:** Create the navigation and container for catalog management.

### Task 3.1: Implement Catalog Page
**Description:** Create `src/pages/settings/OutletCatalog.tsx` using `useTable`.
**Effort:** 1.5h | **Priority:** Medium

### Task 3.2: Register Routes
**Description:** Add `/setting/catalog` to `src/routes/index.tsx`.
**Effort:** 0.5h | **Priority:** Medium

## Phase 4: Edit Modal (4h)
**Goal:** Implement the interactive form for stock limit updates.

### Task 4.1: Implement StockRangeModal
**Description:** Create `src/pages/settings/modal/StockRangeModal.tsx`.
**Acceptance Criteria:**
- [ ] Numeric inputs for `min_stock` and `max_stock`.
- [ ] Validation: min <= max.
- [ ] Trigger update mutation on submit.
**Effort:** 3h | **Priority:** Medium

### Task 4.2: Final Integration & Verification
**Description:** Connect the modal to the table action and verify the full workflow.
**Effort:** 1h | **Priority:** Medium

## Quick Reference Checklist
- [ ] Task 1.1: Define Catalog Types
- [ ] Task 1.2: Implement Catalog Service
- [ ] Task 2.1: Create Table Config
- [ ] Task 3.1: Implement Catalog Page
- [ ] Task 3.2: Register Routes
- [ ] Task 4.1: Implement StockRangeModal
- [ ] Task 4.2: Final Integration

## Next Steps
1. Run `/implement outlet-catalog-management` to start development.

---
*Tasks created with SDD 4.0*
