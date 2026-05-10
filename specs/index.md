# SDD Features Index — franchisee-v2

## Navigation
- [📋 Project Overview](00-overview.md)
- [📁 Active Features](active/)
- [✅ Completed Features](completed/)
- [📌 Backlog](backlog/)

---

## Feature Status Dashboard

### Active Features (In Development)

| Task ID | Feature | Status | Progress | Docs |
|---------|---------|--------|----------|------|
| `franchisee-rebuild` | Franchisee Web App v2 (Vue→React rebuild) | 🟡 In Progress | 62/68 (91%) | [Brief](active/franchisee-rebuild/quick-prd.md) · [Spec](active/franchisee-rebuild/spec.md) · [Plan](active/franchisee-rebuild/plan.md) · [Tasks](active/franchisee-rebuild/tasks.md) · [Todo](active/franchisee-rebuild/todo-list.md) |

### Completed Features
Currently none.

### Backlog Features
Currently none.

---

## Task: franchisee-rebuild — Summary

### What's Done ✅
- Full project scaffold (Vite 8 + React 18 + TypeScript strict)
- Tailwind v4 CSS-first config via `@tailwindcss/vite`
- Redux Toolkit store + RTK Query API layer (JWT auth, 401 handling, file download)
- Auth slice with localStorage persistence (`__frut`)
- All layouts: AuthorizedLayout (sidebar), UnauthorizedLayout
- ProtectedRoute + full route configuration (14+ routes)
- App boot flow: token → getMe → setCredentials / signOut
- All 14 page components implemented:
  - Login, Profile
  - Sales: SessionList, SessionDetail, OrderDetail
  - Reports: DailySales, OutstandingBills, SettlementMonthly, SettlementDaily, ItemSales
  - Cash: CashControl
  - Settings: UserList, UserCreate, UserUpdate
  - Purchase (window.open), Stock (stub)
- Shared UI: PageHeader, StatusBadge, CurrencyText, EmptyState, LoadingScreen, DateRangePicker
- `src/utils/format.ts` — all format/sentinel helpers
- `.env` + `.env.example`
- PWA plugin configured
- `tsc --noEmit` → 0 errors
- `vite build` → ✅ 421KB JS, 22KB CSS

### Pending ⏳
| # | Item |
|---|------|
| 1 | `DataTable.tsx` — TanStack Table wrapper (plain HTML tables currently used) |
| 2 | `SelectCashier.tsx` — searchable user dropdown |
| 3 | PWA icon PNGs (192×192, 512×512) |
| 4 | Chrome PWA installability test |
| 5 | Runtime route + business rule verification (needs backend) |
| 6 | Download functionality smoke test (needs backend) |

---

## Quick Reference

### Key Business Rules Implemented
| Rule | Description | Location |
|------|-------------|----------|
| BR-001 | Sentinel date → "(Ongoing)" | SessionList, SessionDetail |
| BR-002 | null payment name → "Cash" | SessionDetail, OrderDetail |
| BR-003 | Add-on items "+" prefix | OrderDetail |
| BR-004 | Discount row hidden if 0 | OrderDetail |
| BR-005 | Service row hidden if false | OrderDetail |
| BR-006 | After-discount calc display | SessionDetail |
| BR-007 | Supervisor status immutable | UserList |
| BR-008 | Self-management restrictions | UserList, UserUpdate |
| BR-015 | End date +1 day normalization | DateRangePicker |
| BR-016 | Cash filter: individual params | CashControl |

### Stack
- React 18 + TypeScript strict + Vite 8
- Redux Toolkit 2.11.2 + RTK Query
- Tailwind CSS v4 (CSS-first)
- React Router v6 (nested layouts)
- TanStack Table v8 (partial — DataTable pending)
- Recharts (installed, not yet used)
- VitePWA

---

## Statistics
- **Total Features:** 1
- **Active:** 1
- **Completed:** 0
- **Backlog:** 0
- **Todo Items:** 68 total, 62 done, 6 remaining

---

Last updated: 2026-05-06
