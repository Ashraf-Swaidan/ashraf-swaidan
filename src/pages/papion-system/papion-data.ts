/** Typography tokens for Papion case-study pages. */
export const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const BODY_FONT = "var(--font-drh-body)"

/** Public hero loop — swap for `papion-hero-proof.mp4` when ready. */
export const PAPION_VIDEO_HERO = "/assets/lap-animation-assets/papion.mp4"
/** Optional order-flow clip; falls back to hero if missing. */
export const PAPION_ORDER_SPINE_VIDEO =
  "/assets/lap-animation-assets/papion-workflow-order.mp4"

export const PAPION_LOGO = "/assets/selected-works-logos/papion-logo.svg"
export const EXCEL_ICON_SRC = "/assets/excel.svg"

export const EXCEL_FOOTNOTE =
  "I know Excel can do absolutely anything if you're crazy enough to dive into that deep hole. But hey — we're not fans of countless cells."

export const FRICTION_LINE1 = 'Papion is not "a few tabs of data." It is'

export const FRICTION_PILLS = [
  "Eight inventories",
  "Three branches",
  "User roles and permissions",
  "Sales",
  "Customers",
  "Expenses",
  "Suppliers",
  "Wallets",
  "Insights",
  "Calendars",
  "Tasks",
  "Orders",
  "Unpaid flows",
] as const

export const FRICTION_CLOSING_1 = "All supposed to work together somehow."

export const FRICTION_CLOSING_2 =
  "Excel and most off-the-shelf systems were never meant to carry as one humane, everyday product."

export const FRICTION_PILL_STYLES = [
  "bg-sky-200 text-sky-950",
  "bg-emerald-200 text-emerald-950",
  "bg-violet-200 text-violet-950",
  "bg-amber-200 text-amber-950",
  "bg-rose-200 text-rose-950",
  "bg-cyan-200 text-cyan-950",
  "bg-fuchsia-200 text-fuchsia-950",
  "bg-lime-200 text-lime-950",
] as const

export function getFrictionPillDelay(index: number) {
  if (index < 2) return 170
  if (index < 5) return 115
  if (index < 10) return 58
  return 86
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Case-study assets (see context-ai/works/papion-system/capture-guide.md).
 */
export const CASE_ASSETS = {
  inventory: "/assets/papion-case/papion-module-inventory.png",
  sales: "/assets/papion-case/papion-module-sales.png",
  customers: "/assets/papion-case/papion-module-customers.png",
  wallets: "/assets/papion-case/papion-module-wallets.png",
  insights: "/assets/papion-case/papion-module-insights.png",
  suppliers: "/assets/papion-case/papion-module-suppliers.png",
  expenses: "/assets/papion-case/papion-module-expenses.png",
  roles: "/assets/papion-case/papion-module-roles.png",
  ai: "/assets/papion-case/papion-module-ai.png",
  responsiveDesktop: "/assets/papion-case/papion-responsive-sales-desktop.png",
  responsiveTablet: "/assets/papion-case/papion-responsive-sales-tablet.png",
  responsiveMobile: "/assets/papion-case/papion-responsive-sales-mobile.png",
  financeClip: "/assets/lap-animation-assets/papion-finance-control.mp4",
} as const

export type AtlasTabId =
  | "inventory"
  | "sales"
  | "customers"
  | "wallets"
  | "insights"
  | "suppliers"
  | "expenses"
  | "roles"
  | "ai"
  | "responsive"

export type AtlasEntry = {
  id: AtlasTabId
  label: string
  short: string
  body: string
  proof: string[]
  plannedMedia: string
  assetKey: keyof typeof CASE_ASSETS
}

export const ATLAS_ENTRIES: AtlasEntry[] = [
  {
    id: "inventory",
    label: "Inventory",
    short: "Eight structures, one system",
    body: "Basic items, balloons, and helium live alongside laser, flex & vinyl, prints, chocolate, and stands—each with its own fields and logic, not a forced generic table.",
    proof: [
      "Category-first navigation with production-real domains",
      "Branch-aware mental model: workshop vs decor vs balloon retail",
      "Stock and costing context that supports supplier decisions later",
    ],
    plannedMedia:
      "Screenshot: category landing or visual grid — `papion-module-inventory.png`",
    assetKey: "inventory",
  },
  {
    id: "sales",
    label: "Sales",
    short: "One order, many inventories",
    body: "Create orders that mix line items from different inventories in a single flow, with quantity and pricing rules that match each item family—not a pretend unified SKU list.",
    proof: [
      "Mixed-inventory line items in one customer order",
      "Drafts, follow-up, and operational speed under real daily pressure",
      "Calendar, tasks, and branch views that match how events actually run",
    ],
    plannedMedia:
      "Screenshot or clip: order surface + mixed lines — `papion-module-sales.png` / `papion-workflow-order.mp4`",
    assetKey: "sales",
  },
  {
    id: "customers",
    label: "Customers",
    short: "Retail, wholesale, and depth",
    body: "Customer records stay actionable: segmentation, profile insight, and exports so growth and service stay in the same place as execution.",
    proof: [
      "Retail vs wholesale framing in one customer model",
      "Search, filters, and profile analytics that support real calls and visits",
      "Print and export paths for staff who still live on paper sometimes",
    ],
    plannedMedia:
      "Screenshot: list with stats or profile analytics — `papion-module-customers.png`",
    assetKey: "customers",
  },
  {
    id: "wallets",
    label: "Wallets",
    short: "Treasury that matches reality",
    body: "Payments land in wallets—not abstract “status fields.” Transfers, loans, and branch context keep cash legible when orders are only partly paid.",
    proof: [
      "Multiple wallet types and clear transaction history",
      "Loans and internal movements without spreadsheet reconciliation",
      "Tight coupling with expenses and supplier pay-outs",
    ],
    plannedMedia:
      "Screenshot: wallet cards + transactions or transfer — `papion-module-wallets.png`",
    assetKey: "wallets",
  },
  {
    id: "insights",
    label: "Insights",
    short: "Decisions, not decoration",
    body: "Charts are placed where a manager actually decides: general performance, products, customers, branches, and finance—live enough to feel like steering, not reporting.",
    proof: [
      "Layered analytics that respect operational hierarchy",
      "Branch and product views that mirror Papion’s real structure",
      "Finance-adjacent signals next to sales, not on another island",
    ],
    plannedMedia:
      "Screenshot: strongest sales insights view — `papion-module-insights.png`",
    assetKey: "insights",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    short: "Stock has a source",
    body: "Supplier records and supplier orders tie incoming cost and quantity to the right inventory buckets and the wallet that paid—closing the loop from shelf back to purchase.",
    proof: [
      "Supplier orders wired to inventory and wallets",
      "COGS and spend visibility for procurement calls",
      "History that supports cost-over-time thinking",
    ],
    plannedMedia:
      "Screenshot: supplier list or spend context — `papion-module-suppliers.png`",
    assetKey: "suppliers",
  },
  {
    id: "expenses",
    label: "Expenses",
    short: "Beyond supplier COGS",
    body: "Operating expenses, branch and personal attribution, and wallet-backed payments—so net profit is argued from real outflows, not vibes.",
    proof: [
      "One-time and recurring patterns where they matter",
      "Branch and business vs personal classification",
      "Clear read against sales performance in the same product",
    ],
    plannedMedia:
      "Screenshot: expense table or recurring templates — `papion-module-expenses.png`",
    assetKey: "expenses",
  },
  {
    id: "roles",
    label: "Roles & access",
    short: "Surgical permissions",
    body: "Every sensitive route respects roles built by admins—including hiding cost fields from staff who should never see them while keeping their daily tools fast.",
    proof: [
      "Custom role combinations instead of one-size admin/user",
      "Route-level gates aligned with real floor workflow",
      "Optional PIN-style tightening where devices are shared",
    ],
    plannedMedia:
      "Screenshot: role editor or permission matrix — `papion-module-roles.png`",
    assetKey: "roles",
  },
  {
    id: "ai",
    label: "Papion AI",
    short: "Beta intelligence layer",
    body: "Converse with strong models against business data with deliberate, careful access—so answers feel informed without becoming a leak.",
    proof: [
      "Business-grounded prompts over generic chat",
      "Guardrailed data exposure by role and intent",
      "Same platform: AI as a route, not a bolt-on iframe toy",
    ],
    plannedMedia:
      "Screenshot: conversation UI with safe demo data — `papion-module-ai.png`",
    assetKey: "ai",
  },
  {
    id: "responsive",
    label: "Responsive craft",
    short: "Three surfaces, three interfaces",
    body: "Desktop, web, and installable PWA aren’t the same layout squeezed. Many flows are rethought per breakpoint so warehouse, office, and on-site phone work all feel native to their device.",
    proof: [
      "Density and navigation adapted—not just font-size scaling",
      "PWA and Electron paths for the same operational core",
      "Mobile patterns borrowed from real apps staff already trust",
    ],
    plannedMedia:
      "Triptych: desktop / tablet / narrow — `papion-responsive-sales-*.png`",
    assetKey: "responsiveDesktop",
  },
]

export const BRANCH_ROWS = [
  {
    branch: "Balloon & accessories",
    items: ["Basic items", "Balloons", "Helium"],
  },
  {
    branch: "Workshop (print & cut)",
    items: ["Laser cuts", "Flex & vinyl", "Normal prints"],
  },
  {
    branch: "Event decoration",
    items: ["Chocolate items", "Stands"],
  },
] as const
