# Sales Module Power

Papion's Sales module is the execution core of the system. It is built to handle real daily sales pressure, not just record finished orders.

## Why It Stands Out

- **End-to-end order lifecycle**: create, track, review, and resolve orders from one place.
- **Decision-ready analytics in the same workflow**: statistics and insights are part of Sales, not a disconnected reporting tool.
- **Cash-awareness at order time**: sales flows connect to wallet allocation logic and default wallet preferences.
- **Operational flexibility**: supports drafts, calendar planning, tasks, and order merge workflows.
- **Branch intelligence**: includes branch-level dashboarding and cross-view comparison.

## High-Impact Capabilities

### 1) Execution + Control in One Surface
- `OrdersSection`, `CreateOrderSection`, `OrderHistorySection`, and `OrderDetailsModal` support day-to-day sales operations.
- `UnpaidOrders` tracks open revenue risk instead of hiding it in back-office reports.
- `AllDraftsView` and `MergeOrdersModal` reduce friction in complex order scenarios.

### 2) Analytics That Drive Action
- `InsightsSection` and `StatisticsSection` expose deep charting and trend analysis.
- Dedicated statistics components cover order value distribution, customer mix, product-type performance, branch comparisons, and top-customer behavior.
- Teams can move from "what happened" to "what to do next" without leaving the module.

### 3) Real-Time and Role-Aware
- Firestore listeners (`onSnapshot`) keep orders, wallets, and linked data live.
- Access is protected by role checks and optional PIN gating for Sales routes.
- Personal/default wallet logic allows users to work with the right wallet context quickly.

### 4) Built for Real Operations
- Includes mobile-aware controls (collapsible recent orders, responsive layouts).
- Supports full-screen usage patterns for high-focus operational sessions.
- Handles mixed workflows: immediate execution, scheduling, follow-up, and reconciliation.

## Business Value

- **Faster order throughput** through unified tools and fewer context switches.
- **Lower revenue leakage** via unpaid-order visibility and wallet-aware handling.
- **Better management decisions** through embedded branch and performance analytics.
- **Stronger accountability** with linked logs/services and controlled access.

## Key Implementation Areas

- `src/components/sales/SalesLayout.jsx`
- `src/components/sales/InsightsSection.jsx`
- `src/components/sales/Statistics`
- `src/components/sales/order`
- `src/components/sales/branches/BranchesDashboard.jsx`
