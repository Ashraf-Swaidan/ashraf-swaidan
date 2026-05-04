# Papion System (`papion-sys`)

Papion System is a full operations platform built to run a real-world event/decor business from one place.  
It unifies sales execution, inventory control, finance/wallet flows, supplier and expense management, customer intelligence, and role-based team access in a single product.

This project is not a demo dashboard. It is a production-style, domain-heavy system designed to solve day-to-day operational complexity with realtime data and decision-ready analytics.

## Why Papion Exists

Most operations teams juggle many disconnected tools: one for orders, another for expenses, another for customer records, and spreadsheets for finance. Papion addresses that fragmentation by:

- centralizing operational workflows into one platform,
- keeping data realtime and role-aware,
- and converting raw activity into actionable insights.

## Core Power Points

- **Unified Operations Hub**: sales, inventory, customers, suppliers, expenses, and wallets are connected instead of siloed.
- **Deep Analytics Layer**: many specialized charts across revenue, branches, product types, customers, profitability, and order behavior.
- **Finance Control Engine**: multi-wallet transactions, branch-aware allocations, loans, and internal transfers for tighter cash governance.
- **Security and Governance**: authenticated access, role/permission gates, and optional PIN-protected sensitive areas.
- **Cross-Platform Delivery**: runs on web (Vite), can be packaged as desktop app (Electron), and includes PWA capabilities.
- **Realtime by Design**: Firestore listeners and transactional updates keep operational views fresh and consistent.

## What I Achieved With This System

- Built a broad, multi-domain business platform with hundreds of React components and many specialized workflows.
- Designed operational modules that map closely to real business needs instead of generic CRUD-only pages.
- Implemented a strong reporting foundation that helps decision makers spot trends, risks, and opportunities quickly.
- Added architecture for team scaling via permissions, protected routes, and modular domain layouts.
- Extended the product beyond web-only usage with Electron desktop support and update flow.

## Main Modules

### 1) Sales and Insights
- **Sales execution**: one order flow can sell line items from **eight inventory** structures (not a pretend unified catalog). Order types cover **instant**, **due date**, and **event**-style work. **Customer selection** is built for speed; a **barcode scanner** is integrated for counter use. **Partial payment** is first-class, with a dedicated space for **unpaid** follow-up, plus **tasks** tied to the same rhythm.
- **Drafts**: save an order mid-build or reload the customer’s saved draft so a long order is not lost to interruption.
- **Insights**: deep sales analytics—performance, order value, customer behavior, product categories, and related cuts—so managers can steer without leaving the product.

### 2) Inventory
- Structured category/subcategory model.
- Specialized domains (basic, choco, laser, print, flex, balloons, helium, stands) to mirror real production inventory complexity.

### 3) Customers
- Customer management with profile-level analytics.
- Segmentation and behavior-focused metrics to support retention and targeting.

### 4) Expenses and Suppliers
- Expense tracking (including recurring patterns) and branch-level financial visibility.
- Supplier records and supplier-order cost awareness to improve procurement decisions.

### 5) Wallets and Loans
- Multi-wallet treasury operations: transfers, deposits, withdrawals, branch-aware flows.
- Loan lifecycle operations and supporting transaction services for financial traceability.

### 6) Admin, Roles, and Access
- Authentication and role-based access control.
- Permission-driven route gating and optional secondary protection for sensitive views.

## Technical Architecture

- **Frontend**: React + Vite + React Router + Tailwind + shadcn/Radix UI.
- **Visualization**: Recharts for analytics dashboards and domain-specific chart components.
- **State and Context**: React Context (`Auth`, `Settings`, theme) plus focused stores where needed (e.g. Studio).
- **Backend Services**: Firebase Auth + Firestore + Storage.
- **Cloud Automation**: Firebase Functions for backend automation tasks.
- **Desktop Runtime**: Electron integration for desktop distribution and update workflow.

## Repository Map

- `src/App.jsx` - route composition and top-level module wiring.
- `src/components/sales` - sales workflows and analytics.
- `src/components/inventory` - inventory categories and specialized item domains.
- `src/components/Customers` - customer management and profile analytics.
- `src/components/expenses` - expense operations and insights.
- `src/components/suppliers` - supplier workflows and spend-related context.
- `src/components/wallets` - wallets, transfers, and finance-related operations.
- `src/context` - authentication, settings, and app-wide context state.
- `src/services` - reusable service-layer business logic (including wallet transactions).
- `functions` - Firebase Cloud Functions.
- `electron-main.cjs` - Electron desktop entry/runtime behavior.

## Vision

Papion System demonstrates how a single, well-architected platform can move an operations-heavy business from fragmented manual coordination to realtime, measurable, role-aware execution.