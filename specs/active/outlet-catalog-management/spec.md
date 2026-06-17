# Specification: Outlet Catalog Management

**Task ID:** outlet-catalog-management
**Created:** 2026-06-03
**Status:** Ready for Planning
**Version:** 1.0

## 1. Problem Statement
- **The Problem:** Outlet managers currently lack a centralized way to control their local catalog availability and safety stock levels.
- **Current Situation:** Stock levels and catalog availability are often managed manually or through cumbersome processes, leading to operational inefficiencies.
- **Desired Outcome:** A streamlined management page within the portal to update `min_stock`/`max_stock` and toggle item status (Active/Deactive) directly via the `catalog-outlet` API.

## 2. User Personas
### Primary User: Outlet Manager
- **Who:** The person responsible for the inventory and menu availability at the outlet.
- **Goals:** Maintain optimal stock levels and ensure customers only see available items.
- **Pain points:** Inability to self-service stock thresholds and item availability.

## 3. Functional Requirements
### FR-1: View Catalog List
**Description:** Retrieve and display catalog items specific to the outlet.
**User Story:**
> As an Outlet Manager, I want to view my outlet's catalog so that I know which items are currently available and what their stock limits are.
**Acceptance Criteria:**
- [ ] Fetch data from `GET /catalog-outlet`.
- [ ] Render a table with item name, `min_stock`, `max_stock`, and status.

### FR-2: Update Stock Thresholds
**Description:** Edit stock limit settings for an item.
**User Story:**
> As an Outlet Manager, I want to update `min_stock` and `max_stock` for catalog items so that I can prevent inventory issues.
**Acceptance Criteria:**
- [ ] Modal form to edit `min_stock` and `max_stock` values.
- [ ] `PUT /catalog-outlet/:id` to save changes.
- [ ] Validation: `min_stock` must be less than or equal to `max_stock`.

### FR-3: Toggle Item Status
**Description:** Activate or deactivate a catalog item.
**User Story:**
> As an Outlet Manager, I want to set items as active or inactive so that I can control menu availability in real-time.
**Acceptance Criteria:**
- [ ] Toggle switch in the catalog list.
- [ ] API call to `PUT /catalog-outlet/:id/active` (when activating) or `PUT /catalog-outlet/:id/deactive` (when deactivating).

## 4. Non-Functional Requirements
- **Performance:** Updates should reflect in the list immediately after a successful API response.
- **Reliability:** UI must handle API errors gracefully with clear user feedback.

## 5. Out of Scope
- ❌ **Bulk Updates:** This iteration focuses on individual item updates.
- ❌ **New Item Creation:** Items must be managed centrally by corporate.

## 6. Edge Cases & Error Handling
| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid Stock values | Validation error shown on form. |
| API Error (500) | Toast notification error; UI state stays unchanged. |
| Offline | User notified of connectivity issues. |

## 7. Success Metrics
| Metric | Target |
|--------|--------|
| Status Toggle latency | < 500ms |
| Form submission accuracy | 100% |

## 8. Open Questions
- None.

## 9. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-03 | Initial specification |

## Next Steps
1. Run `/plan outlet-catalog-management` to design the technical architecture.

*Specification created with SDD 4.0*
