# Quick PRD: Franchisee Web App v2 (Rebuild)

**Task ID:** franchisee-rebuild | **Date:** 2026-05-06 | **Version:** 1.0

---

## Problem
Legacy franchisee portal (Vue 2 + Element UI + Vuetify 1.x) is EOL, unmaintainable, no TypeScript. Business logic is solid — rebuild with modern stack preserving 100% of rules.

## Stack
| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript (strict) |
| State | Redux Toolkit (RTK) + RTK Query |
| Styling | Tailwind CSS |
| Tables | TanStack Table |
| Charts | Recharts |
| Router | React Router v6 |
| Build | Vite |
| HTTP | RTK Query (auto-caching, devtools) |
| Auth | JWT in encrypted storage or httpOnly cookie |
| PWA | Vite PWA plugin |

---

## Core Features (14 pages)

| # | Page | API Endpoints | Key Rules |
|---|------|--------------|-----------|
| 1 | Login | POST `/auth/signin`, GET `/auth/me` | JWT, token persistence |
| 2 | Profile | PUT `/auth/me` | Name/username readonly, pw only |
| 3 | Session List | GET `/sales/session` | Date filter (+1 day), payment popup |
| 4 | Session Detail | GET `/sales/session/:id` | Cash recon, payments, categories, topups |
| 5 | Order Detail | GET `/sales/order/:id` | Items, discount, service, tax calc |
| 6 | Report: Daily | GET `/report/sales/daily` | Date, total order |
| 7 | Report: Outstanding | GET `/report/sales/outstanding` | Summary header, download, membership |
| 8 | Report: Settlement Monthly | GET `/report/settlement` (yearly) | Dynamic columns, drill-down |
| 9 | Report: Settlement Daily | GET `/report/settlement` (monthly) | Session time, dynamic columns |
| 10 | Report: Item Sales | GET `/report/sales/item` | Name, total sold |
| 11 | Cash Control | GET `/report/cash/control` | 4 metric cards, session table |
| 12 | Purchase | — | Open external URL with username param |
| 13 | User List | GET `/user` | Activate/deactivate, self-protection |
| 14 | User Create/Update | POST/PUT `/user` | Form validation, redirect on success |

---

## Pricing Calculation (Order Detail)
```
subtotal        = total_bill        (shown if discount > 0)
discount        = discount_value    (shown if discount > 0)
service         = service_charge_value  (shown if service_charge === true)
total           = total_charges     (always shown)
tax             = subtotal_tax      (always shown)
afterDiscount   = total_charges - total_service_charge
```

## Session Cash Flow
```
Starting Cash (cash_started)
  + Sales Cash (from cash_payments)
  + Topups (cash top-ups during session)
  - Expected Cash = cash_due
  - Bill Payments Collected = bill_payment
  → Ending Cash (cash_finished)
  → Deficiency = cash_due - cash_finished
```

## Key UI Rules
- `finished_at === "0001-01-01T00:00:00Z"` → "(Ongoing)"
- `payment_method === null` → display "CASH"
- `additional_id` set → prefix item name with "+"
- `last_login_at === "0001-01-01T00:00:00Z"` → "-"
- User cannot toggle own status
- Supervisor user shown with checkmark, not toggle

## Out of Scope
Backend changes, POS app, external ordering platform rebuild, mobile-native

## Success Target
100% feature parity + TypeScript strict + < 500KB bundle + > 60% test coverage