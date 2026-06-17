# Specification: Franchise API Services & Types Synchronization

**Task ID:** api-synchronization
**Created:** 2026-06-04
**Status:** Ready for Planning
**Version:** 1.2

---

## 1. Problem Statement
- **The Problem:** The current React frontend has outdated endpoint paths (specifically in the Catalog module) and lacks services or types for newly introduced backend endpoints (Membership, Stock, Profile, and Outlet service charges). Additionally, the authentication payload parameter has changed from `username` to `identifier`. This discrepancy prevents successful integration with the backend API.
- **Current Situation:** Developers cannot build UI pages for Member Listing, Stock/Inventory Logs, or Edit Profile because the underlying Redux Toolkit (RTK) Query services and TypeScript interfaces do not exist or are incorrect.
- **Desired Outcome:** All frontend API services (`src/services/`) and data models (`src/services/types/`) are fully synchronized with `Franchise.postman_collection.json`, exposing correct React hooks for the frontend UI.

---

## 2. User Personas
### Primary User: Frontend Developer / UI Integrator
- **Who:** Developers building the user interface for the franchisee application.
- **Goals:** Quickly import robust, type-safe React hooks for backend queries and mutations.
- **Pain points:** Cryptic API errors due to mismatched URLs, missing typings, or incorrect payload formats.

---

## 3. Functional Requirements

Below is the side-by-side comparison contract mapping. All endpoints in the "Target Path" column must be fully implemented and correct.

| Module | Method | Target Path (Postman Collection) | Action Required | Expected Types |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Update path (from `/auth/signin`) & body params | `LoginRequest` (uses `identifier`), `LoginResponse` |
| **Profile** | `GET` | `/profile/me` | Implement query (moved from `/auth/me`) | `UserProfile` |
| **Profile** | `PUT` | `/profile/me` | Implement mutation (moved from `/auth/me`) | `ProfileUpdatePayload` |
| **Catalog** | `PUT` | `/catalog-outlet/:id/activate` | Update path (from `/catalog-outlet/:id/active`) | `ActivateCatalogRequest` |
| **Catalog** | `PUT` | `/catalog-outlet/:id/deactivate` | Update path (from `/catalog-outlet/:id/deactive`) | `DeactivateCatalogRequest` |
| **Membership** | `GET` | `/membership` | Create new service query (Get List) | `Membership[]`, pagination params |
| **Membership** | `GET` | `/membership/:id` | Create new service query (Get Detail) | `MembershipDetail` |
| **Membership** | `GET` | `/membership/:id/log` | Create new service query (Get Logs) | `MembershipLog[]` |
| **Stock** | `GET` | `/stock` | Create new service query (Get Stock List) | `StockItem[]` |
| **Stock** | `GET` | `/stock/log` | Create new service query (Get Stock Movement Logs) | `StockLog[]` |
| **Outlet** | `PUT` | `/outlet` | Create new service mutation (Update charges) | `OutletUpdatePayload` |

*Note: Legacy endpoints `/user` and `/report` that exist in codebase but are omitted from Postman MUST be kept intact and running.*

### Detailed Payload Requirements

1. **Auth Login Payload (`LoginRequest`)**
   - Must use `identifier` (string, required) instead of `username`.
   - Must use `password` (string, required).

2. **Catalog Thresholds Update Payload (`CatalogUpdatePayload`)**
   - Must accept `min_stock` (number, required).
   - Must accept `max_stock` (number, required).

3. **Outlet Configuration Payload (`OutletUpdatePayload`)**
   - Must accept `service_charges` (number, required).

4. **Profile Update Payload (`ProfileUpdatePayload`)**
   - Must accept `name` (string, required).
   - Must accept `password` (string, optional/nullable).
   - Must accept `confirm_password` (string, optional/nullable).

---

## 4. Non-Functional Requirements
- **Type Safety:** 100% type coverage for request payloads and response shapes using TypeScript interfaces.
- **RTK Query Standards:** Follow the project's existing structure utilizing `baseQuery` for token authentication injection.
- **Cache Management:** Implement query tag invalidations (`providesTags` / `invalidatesTags`) to auto-refresh lists when data changes (e.g., updating profile invalidates profile queries).

---

## 5. Out of Scope
- ❌ **UI Integration:** Building forms, buttons, layout modifications, or routing updates.
- ❌ **Client-side Mocking:** Developing local mocks; queries must call actual backend endpoints.

---

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
| :--- | :--- |
| Mismatched passwords on Profile update | API returns validation error; typings should reflect potential HTTP 422 error structures. |
| Unauthenticated request | `baseQuery` automatically handles token injection. If expired, token interceptor should route to login. |
| Non-numeric input for `service_charges` | API payload types must strictly enforce number typing on client side. |

---

## 7. Success Metrics
- **Type Check Validation:** zero compilation/linter errors during `npm run build` or `tsc` check.
- **100% Path Accuracy:** Paths in `src/services/` perfectly mirror the raw Postman URLs.

---

## 8. Revision History
| Version | Date | Changes |
| :--- | :--- | :--- |
| 1.2 | 2026-06-04 | Added explicit detailed payload parameters and type requirements. |
| 1.1 | 2026-06-04 | Added side-by-side API alignment table matching Postman collection. |
| 1.0 | 2026-06-04 | Initial specification based on Franchise Postman collection. |

---
*Specification created with SDD 4.0*
