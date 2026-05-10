# Research: UI Component Audit & Website Rebuild Plan

**Task ID:** ui-audit
**Date:** 2026-05-07
**Status:** Complete
**Version:** 2.0

---

## Executive Summary

Full audit of `franchisee-v2` pages against the Enigma UI component library (`src/components/ui/`). Two critical findings:

1. **7 components imported in pages don't exist** in the library — they must be created before rebuild.
2. **All 15 pages** use raw HTML elements (inputs, buttons, tables, pagination) instead of Enigma components.

The icon migration from `react-icons` → `lucide-react` is **already complete** (7 files migrated, `react-icons` fully removed).

Rebuild priority: **missing component creation → broken import fixes → form pages → table pages → detail pages**.

---

## Enigma UI Library Inventory

### Available Components (34+)

Exported via `src/components/ui/index.ts`:

| Component | Location | Notes |
|-----------|----------|-------|
| Accordion | `accordion/` | |
| Alert | `alert/` | `success/error/warning/info` variants, lucide icons ✅ |
| Avatar / AvatarGroup | `avatar/` | |
| Badge | `badge/` | `primary/secondary/accent/success/warning/error/ghost/neutral` |
| Breadcrumbs | `breadcrumbs/` | |
| Button | `button/` | `primary/accent/error/default/ghost`, `soft/outline` styleType, loading spinner |
| Card / CardHeader / CardBody / CardActions / CardMedia | `card/` | |
| Checkbox | `checkbox/` | |
| DatePicker | `date-picker/` | `single` + `range` modes, lucide `Calendar` ✅ |
| Divider | `divider/` | |
| Drawer | `drawer/` | |
| Dropdown / DropdownItem | `dropdown/` | position control, `contentClassName` |
| File | `file/` | |
| Filter | `filter/` | |
| Input | `input/` | `text/number/currency/time/phone/textarea/password`, prefix/suffix |
| Loading / FullPageLoading | `loading/` | |
| Menu | `menu/` | |
| Modal | `modal/` | compound: Wrapper, Header, Body, Footer |
| Navbar | `navbar/` | |
| Pagination | `pagination/` | `currentPage/totalPages/onChange`, ellipsis at 5+ pages |
| Radio | `radio/` | |
| RadioButton | `radio-button/` | |
| Select | `select/` | |
| SelectRemote | `select-remote/` | |
| Skeleton | `skeleton/` | |
| Steps | `steps/` | |
| Tabs | `tabs/` | |
| Toast | `toast/` | via `EnigmaProvider` context |
| Toggle | `toggle/` | |
| Tooltip | `tooltip/` | |
| Layout | `layout/` | |

### Missing Components (7) — MUST CREATE FIRST

Imported in pages via `@/components/ui` but **do not exist** anywhere:

| Component | Purpose | Used In | Recommendation |
|-----------|---------|---------|----------------|
| `PageHeader` | Page title + breadcrumbs + actions slot | ALL pages | Create: `src/components/ui/page-header/` |
| `LoadingSpinner` | Inline/page loading indicator | ALL pages | Alias for existing `Loading` or create simple wrapper |
| `EmptyState` | No-data / filtered-empty state | 7 pages | EXISTS at `table/empty-state.tsx` but NOT exported. Fix barrel export. |
| `CurrencyText` | Formatted Rp currency display | 4 pages | Wrapper around existing `currencyFormat()` util |
| `StatusBadge` | Colored status pill | SessionList, CashControl | Wrapper around `Badge` with status→variant mapping |
| `DateRangePicker` | Dual date picker | SessionList, OutstandingBills, CashControl | Wrapper around `DatePicker mode="range"` with label/clear |
| `SelectCashier` | Cashier/user dropdown filter | 4 report pages | Domain-specific `SelectRemote` wrapper |

### Legacy/Dead Components

`src/components/ui/table/` has 4 files depending on non-existent Redux `table` slice:

| File | Problem | Status |
|------|---------|--------|
| `render.tsx` | Reads `state.table.data[name].*`, imports `../../../services/table/const` | DEAD — neither path exists |
| `pagination.tsx` | Reads `state.table.data[name].limit/total/page` | DEAD |
| `tools.tsx` | Reads `state.table.data[name].textSearch` | DEAD |
| `wrapper.tsx` | Empty div wrapper | DEAD |
| `table.css` | Table styling | Keep for reference |

**Action:** Mark as legacy, do not use, clean up in Phase 3.

---

## Broken Imports (4 files)

Store is at `src/store/index.ts` (slices: `auth` + `api` only). No `table` slice.

| File | Bad Import | Fix |
|------|-----------|-----|
| `src/utils/guard.tsx` | `from "@/services/store"` | → `from "@/store"` |
| `src/components/ui/table/tools.tsx` | `from "../../../services/store"` | → `from "@/store"` |
| `src/components/ui/table/render.tsx` | `from "../../../services/store"` | → `from "@/store"` |
| `src/components/ui/table/pagination.tsx` | `from "../../../services/store"` | → `from "@/store"` |

> Note: table files are dead code. Fixing imports won't make them work (missing `table` slice). But guard.tsx is live.

---

## Error Handling Inconsistency

| Page | Error Key Used | Correct Key | Action |
|------|---------------|-------------|--------|
| `Login.tsx` | `data.errors` | ✅ `data.errors` | None |
| `Profile.tsx` | `data.validations` | ❌ | Change to `data.errors` |
| `UserCreate.tsx` | `data.validations` | ❌ | Change to `data.errors` |
| `UserUpdate.tsx` | `data.validations` | ❌ | Change to `data.errors` |

---

## Page-by-Page Mapping

### Form Pages (4)

| Page | Current Pattern | Should Use | Effort |
|------|----------------|------------|--------|
| **Login.tsx** | Raw `<input>`, raw `<button>`, inline `AlertCircle`+`<p>` | `Input`, `Button`, `Alert` | 1h |
| **Profile.tsx** | Raw `<input>`, raw `<button>`, inline error | `Input`, `Button`, `Alert` | 1h |
| **UserCreate.tsx** | Raw `<input>` in loop, raw `<button>` | `Input`, `Button`, `Alert` | 1h |
| **UserUpdate.tsx** | Raw `<input>`, raw `<button>` | `Input`, `Button`, `Alert` | 1h |

**Common changes:**
- `<input className="..." />` → `<Input label="..." error={errors.field} />`
- `<button>` → `<Button variant="primary">`
- Inline `AlertCircle` + `<p>` → `<Alert type="error" message={...} />`
- Fix `validations` → `errors` in Profile/UserCreate/UserUpdate

### Table Pages with Manual Pagination (7)

| Page | Raw Table | Manual Pagination | Filters Used | Summary Cards | Effort |
|------|-----------|-------------------|--------------|---------------|--------|
| **SessionList** | ✅ | ✅ (Prev/Next + page numbers) | `DateRangePicker`, `StatusBadge` | — | 2h |
| **DailySales** | ✅ | ✅ (5 pages max) | — | — | 1.5h |
| **ItemSales** | ✅ | ✅ (5 pages max) | — | — | 1.5h |
| **OutstandingBills** | ✅ | ✅ | `DateRangePicker`, `SelectCashier`, download | — | 2h |
| **SettlementDaily** | ✅ | — | `SelectCashier`, raw `<select>` | — | 1h |
| **SettlementMonthly** | ✅ | — | `SelectCashier`, raw `<select>`, download | ✅ metric cards | 1.5h |
| **CashControl** | ✅ | — | `DateRangePicker`, `SelectCashier` | ✅ metric cards | 2h |

**Common changes across all:**
- Raw `<table>` → keep structure but use consistent Enigma styling (or build table wrapper)
- Manual Prev/Next pagination → `<Pagination currentPage={} totalPages={} onChange={} />`
- Custom empty state → `<EmptyState type="empty|filtered" />`
- Custom download button → `<Button variant="accent" className="text-base-100"><Download /></Button>`
- Raw `<select>` → `<Select options={} />`
- Summary cards → `<Card><CardBody>...</CardBody></Card>`

### Detail Pages (2)

| Page | Current Pattern | Should Use | Effort |
|------|----------------|------------|--------|
| **SessionDetail** | `<dl>/<dt>/<dd>` + raw `<table>` | `Card` + styled table | 1h |
| **OrderDetail** | `<dl>/<dt>/<dd>` + raw `<table>` | `Card` + styled table | 1h |

### No-Action Pages (2)

| Page | Reason |
|------|--------|
| `Purchase.tsx` | Redirect only, returns null |
| `Stock.tsx` | Empty placeholder, uses `FilterOptions` only |

---

## Enigma Component API Quick Reference

### Button
```tsx
<Button variant="primary" styleType="soft" size="md" shape="circle" isLoading disabled>
  Label
</Button>
```
Variants: `primary | accent | error | default | ghost`
StyleTypes: `soft | outline | (solid default)`
Sizes: `xs | sm | md | lg`

### Input
```tsx
<Input type="text" label="Name" required error="Required" hint="Helper"
  prefix={<Icon />} suffix={<Icon />} size="md" variant="default"
  value={v} onChange={fn} disabled />
```
Types: `text | number | currency | time | phone | textarea | password`

### Alert
```tsx
<Alert type="error" title="Error" message="Something went wrong" />
```
Types: `success | error | warning | info`

### Pagination
```tsx
<Pagination currentPage={page} totalPages={total} onChange={(p) => setPage(p)} />
```

### Select
```tsx
<Select options={[{ label: "A", value: "1" }]} value="1" onChange={fn}
  size="sm" bordered placeholder="Choose..." disabled />
```

### DatePicker (range mode)
```tsx
<DatePicker mode="range" value={[start, end]} onChange={([s, e]) => fn(s, e)}
  format="YYYY-MM-DD" label="Date Range" />
```

### Card
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardActions>Actions</CardActions>
</Card>
```

### Badge
```tsx
<Badge variant="success">Active</Badge>
```
Variants: `primary | secondary | accent | success | warning | error | ghost | neutral`

---

## Rebuild Priority & Phases

### Phase 0: Prerequisites (do first, ~30 min)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 0.1 | Fix `guard.tsx` import: `@/services/store` → `@/store` | 1 file | 2 min |
| 0.2 | Export `EmptyState` from `src/components/ui/index.ts` | 1 file | 1 min |
| 0.3 | Create `PageHeader` component | New | 30 min |
| 0.4 | Create `LoadingSpinner` component (or alias `Loading`) | New | 10 min |
| 0.5 | Create `CurrencyText` component | New | 10 min |
| 0.6 | Create `StatusBadge` component (wraps `Badge`) | New | 15 min |
| 0.7 | Create `DateRangePicker` component (wraps `DatePicker mode="range"`) | New | 20 min |
| 0.8 | Create `SelectCashier` component (domain-specific select) | New | 15 min |

### Phase 1: Forms — HIGH priority (~4h)

| # | Page | Changes |
|---|------|---------|
| 1.1 | `Login.tsx` | `Input`, `Button`, `Alert` |
| 1.2 | `UserCreate.tsx` | `Input`, `Button`, `Alert` + fix error key |
| 1.3 | `UserUpdate.tsx` | `Input`, `Button`, `Alert` + fix error key |
| 1.4 | `Profile.tsx` | `Input`, `Button`, `Alert` + fix error key |

### Phase 2: Tables — MEDIUM priority (~12h)

| # | Page | Key Changes |
|---|------|-------------|
| 2.1 | `SessionList.tsx` | `Pagination`, `EmptyState`, `DateRangePicker`, `StatusBadge` |
| 2.2 | `DailySales.tsx` | `Pagination`, `EmptyState` |
| 2.3 | `ItemSales.tsx` | `Pagination`, `EmptyState` |
| 2.4 | `OutstandingBills.tsx` | `Pagination`, `EmptyState`, `DateRangePicker`, `SelectCashier`, `Button` |
| 2.5 | `SettlementDaily.tsx` | `Select`, `EmptyState` |
| 2.6 | `SettlementMonthly.tsx` | `Card`, `Select`, `EmptyState`, `Button` |
| 2.7 | `CashControl.tsx` | `Card`, `DateRangePicker`, `SelectCashier`, `EmptyState` |

### Phase 3: Details + Cleanup — LOW priority (~3h)

| # | Task | Files |
|---|------|-------|
| 3.1 | Rebuild `SessionDetail.tsx` | `Card` for info display |
| 3.2 | Rebuild `OrderDetail.tsx` | `Card` for info display |
| 3.3 | Remove legacy dead table components | `render.tsx`, `pagination.tsx`, `tools.tsx`, `wrapper.tsx` |
| 3.4 | Fix remaining broken imports in dead files | `tools.tsx`, `render.tsx`, `pagination.tsx` |

---

## Key Patterns to Follow

1. **Icons**: Always `lucide-react` — migration complete ✅
2. **CSS classes**: DaisyUI classes (`card`, `btn-primary`, `table-base`) are intentional design tokens — keep them
3. **Error handling**: Always `data.errors`, never `data.validations`
4. **Form fields**: `<Input label="..." error={errors.field} />` — not raw `<input>`
5. **Buttons**: `<Button variant="primary">` — not raw `<button>`
6. **Errors**: `<Alert type="error">` — not inline `AlertCircle + <p>`
7. **Pagination**: `<Pagination currentPage={} totalPages={} onChange={} />` — not manual Prev/Next
8. **Empty states**: `<EmptyState type="empty|filtered" />` — not custom inline
9. **Downloads**: `<Button variant="accent" className="text-base-100"><Download className="w-5 h-5" /></Button>`
10. **Currency**: `<CurrencyText value={amount} />` — wraps `currencyFormat()`

---

## Open Questions

1. **Table component strategy**: Build a new Enigma `Table` wrapper or keep raw `<table>` with Enigma styling? Current legacy `table/render.tsx` is dead (requires non-existent Redux slice). Pages use manual tables. TanStack `DataTable` exists but isn't used in any page.
2. **DateRangePicker vs DatePicker**: The existing `DatePicker` already supports `mode="range"`. Should `DateRangePicker` just be a pre-configured `<DatePicker mode="range" />` with label/clear?
3. **CurrencyText**: Simple `<span>{currencyFormat(value)}</span>` wrapper, or add formatting options?
4. **PageHeader**: What props? Suggested: `title`, `subtitle`, `breadcrumbs`, `actions` (ReactNode slot), `backUrl`.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-05-07 | Full page-by-page rebuild audit, missing component inventory, phase plan |
| 1.0 | 2026-05-07 | Initial icon migration research (now complete) |

---

*Research completed with SDD 2.0*
