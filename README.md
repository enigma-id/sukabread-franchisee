# Sukabread Franchisee

Franchisee management portal for Sukabread. Dashboard, reports, member management, stock control, withdrawal requests, and outlet settings.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit (RTK Query)
- **UI:** Custom component library (shadcn/ui-inspired)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── app/         # App-specific components
│   ├── layout/      # Layout components
│   └── ui/          # Base UI primitives
├── hooks/           # Shared hooks
├── pages/           # Route pages
│   ├── dashboard/
│   ├── membership/
│   ├── outlet-topup/
│   ├── reports/     # Report modules (cash control, outstanding, settlement, product sales)
│   ├── settings/
│   ├── stock/
│   ├── table/       # Shared table components
│   ├── withdrawal/
│   └── ...
├── services/        # API layer
│   ├── auth/
│   ├── catalog/
│   ├── dashboard/
│   ├── outlet/
│   ├── report/
│   ├── table/       # Generic table API with pagination/filtering
│   ├── types/
│   ├── user/
│   ├── withdrawal/
│   └── ...
└── utils/           # Utility functions
```

## Features

- **Dashboard** — Daily omzet, sales graph, cashier performance, peak hours, top menu
- **Reports** — Cash control, outstanding bills, settlement, product sales (with date range & filters)
- **Membership** — Member list, detail, balance history
- **Stock** — Stock levels, stock movement logs
- **Withdrawal** — Request & manage outlet withdrawals
- **Outlet Topup** — Balance top-ups
- **Settings** — Outlet profile, service charges, catalog management
