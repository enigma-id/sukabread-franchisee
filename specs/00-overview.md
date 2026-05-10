# Project Overview: franchisee-v2

## Project Description
Rebuild of the legacy `clients/web/franchisee` Vue 2 franchisee portal into a modern React 18 SPA, preserving 100% of existing business logic, workflows, and data flows from the original application.

## Project Goals
- Translate Vue 2 codebase → React 18 + TypeScript (strict mode)
- Modernize UI: Tailwind CSS, Recharts for reporting
- Improve state management: Redux Toolkit (RTK) + RTK Query
- Maintain all 20 identified business rules 1:1
- PWA support for offline/installable experience
- Production-ready build under 500KB gzip

## Architecture Overview
Single-page application with:
- **Authentication**: JWT token via RTK Query, localStorage persistence (`__frut` key)
- **State**: Redux Toolkit store with `auth` slice + `api` slice (RTK Query)
- **Routing**: React Router v6 with nested layouts (Authorized / Unauthorized)
- **API**: RTK Query with JWT Bearer injection, 401 auto-signOut, file download intercept
- **Layout**: Sidebar navigation with collapsible mobile support

## Technology Stack
- **Runtime**: React 18, React Router v6
- **Language**: TypeScript (strict mode)
- **State**: Redux Toolkit 2.11.2, RTK Query
- **Styling**: Tailwind CSS v4 (CSS-first config via `@tailwindcss/vite`)
- **Tables**: TanStack Table v8 (partial — wrapper pending)
- **Charts**: Recharts
- **Build**: Vite 8
- **PWA**: vite-plugin-pwa (autoUpdate mode)

## Current Status
- **Phase:** Implementation (Phase 6 of 6)
- **Version:** 1.0.0
- **Build Status:** ✅ Passing (421KB JS, 22KB CSS, 1.62s)
- **Last Updated:** 2026-05-06

## Active Features
- **franchisee-rebuild** — Vue→React rebuild (62/68 tasks complete, 91%)

## Completed Features
None yet.

## Backlog Features
- `DataTable.tsx` — TanStack Table wrapper component
- `SelectCashier.tsx` — searchable cashier dropdown
- PWA icon assets (192×192, 512×512 PNG)

## Links
- [Todo List](active/franchisee-rebuild/todo-list.md)
- [Technical Plan](active/franchisee-rebuild/plan.md)
- [Specification](active/franchisee-rebuild/spec.md)