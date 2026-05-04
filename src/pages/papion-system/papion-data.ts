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

/** Tabs for the focused module explorer (pick one area, not the full atlas). */
export type ExplorerModuleId =
  | "sales"
  | "inventory"
  | "expenses"
  | "suppliers"
  | "customers"
  | "wallets"
  | "ai"
  | "insights"

export type ExplorerPrimaryMedia =
  | {
      kind: "image"
      assetKey: keyof typeof CASE_ASSETS
      caption?: string
    }
  | {
      kind: "video"
      /** Public path, e.g. order-flow clip */
      src: string
      /** Shown if the video fails to load */
      posterAssetKey?: keyof typeof CASE_ASSETS
    }

export type ExplorerModuleEntry = {
  id: ExplorerModuleId
  label: string
  headline: string
  intro: string
  /** 2–3 uncommon beats; kept short on purpose */
  rareFeatures: readonly string[]
  whyMatters: string
  primaryMedia: ExplorerPrimaryMedia
  plannedMediaFallback: string
}

export const MODULE_EXPLORER_ENTRIES: ExplorerModuleEntry[] = [
  {
    id: "sales",
    label: "Sales",
    headline: "Orders that mix inventories without pretending they are one catalog.",
    intro:
      "Retail and wholesale profiles, drafts, follow-up, and a calendar that respects real delivery pressure. One cart can carry line items from different production families with the right rules for each.",
    rareFeatures: [
      "Mixed-inventory lines in a single customer order",
      "Unpaid and partial-pay visibility next to the sale",
      "Tasks and calendar tied to sales rhythm, not a separate app",
    ],
    whyMatters:
      "Decor businesses sell stories and deadlines—sales tooling has to match how stock and money actually move.",
    primaryMedia: {
      kind: "video",
      src: PAPION_ORDER_SPINE_VIDEO,
      posterAssetKey: "sales",
    },
    plannedMediaFallback:
      "Screenshot or clip: order surface with mixed lines — `papion-module-sales.png` / `papion-workflow-order.mp4`",
  },
  {
    id: "inventory",
    label: "Inventory",
    headline: "Eight structures, one system—not one forced generic table.",
    intro:
      "Balloons, helium, laser, flex, prints, chocolate, stands: each family gets fields and logic that match production, so staff never argue with a spreadsheet-shaped schema.",
    rareFeatures: [
      "Category-first navigation aligned to workshop vs retail vs decor",
      "Branch-aware stock mental models",
      "Room for costing that supplier orders can later explain",
    ],
    whyMatters:
      "When shelf reality is messy, the inventory model has to stay honest or everything downstream lies.",
    primaryMedia: { kind: "image", assetKey: "inventory" },
    plannedMediaFallback:
      "Screenshot: category landing or grid — `papion-module-inventory.png`",
  },
  {
    id: "expenses",
    label: "Expenses",
    headline: "Operating spend with branch and personal context.",
    intro:
      "Beyond supplier COGS: everyday outflows, attribution, and wallet-backed payments so profit conversations are grounded in what actually left the business.",
    rareFeatures: [
      "Recurring and one-off templates where teams feel them",
      "Branch vs business vs personal classification",
      "Reads next to revenue without exporting to another tool",
    ],
    whyMatters:
      "Margins get argued every week—expenses belong in the same narrative as sales.",
    primaryMedia: { kind: "image", assetKey: "expenses" },
    plannedMediaFallback:
      "Screenshot: expense table or recurring row — `papion-module-expenses.png`",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    headline: "Purchases tied to stock and the wallet that paid.",
    intro:
      "Supplier records and supplier orders close the loop from shelf back to purchase, with cost history that supports real procurement calls.",
    rareFeatures: [
      "Supplier orders wired to the right inventory buckets",
      "Spend and COGS signals without a parallel spreadsheet",
      "History that supports cost-over-time thinking",
    ],
    whyMatters:
      "Stock has a source; when purchase, inventory, and cash disagree, teams burn weekends reconciling.",
    primaryMedia: { kind: "image", assetKey: "suppliers" },
    plannedMediaFallback:
      "Screenshot: supplier list or order context — `papion-module-suppliers.png`",
  },
  {
    id: "customers",
    label: "Customers",
    headline: "Retail, wholesale, and depth in one actionable profile.",
    intro:
      "Segments, search, profile insight, and export paths so growth and service stay beside execution instead of in another tab farm.",
    rareFeatures: [
      "Retail vs wholesale framing without duplicate records",
      "Filters that match how staff actually find people on busy days",
      "Print or export when the floor still needs paper",
    ],
    whyMatters:
      "Customer context should be present before anyone quotes or commits a date.",
    primaryMedia: { kind: "image", assetKey: "customers" },
    plannedMediaFallback:
      "Screenshot: list with stats or analytics — `papion-module-customers.png`",
  },
  {
    id: "wallets",
    label: "Wallets",
    headline: "Treasury that matches partial pays and branch reality.",
    intro:
      "Payments land in wallets—not abstract status fields—with transfers, loans, and traceability when orders are only partly settled.",
    rareFeatures: [
      "Multiple wallet types with clear transaction history",
      "Internal movements without manual spreadsheet reconciliation",
      "Tight coupling with expenses and supplier pay-outs",
    ],
    whyMatters:
      "Cash has to stay legible when the business runs on deposits, IOUs, and branch float.",
    primaryMedia: { kind: "image", assetKey: "wallets" },
    plannedMediaFallback:
      "Screenshot: wallets or transfer UI — `papion-module-wallets.png`",
  },
  {
    id: "ai",
    label: "AI",
    headline: "Models on your operations—with the same permission story.",
    intro:
      "A beta route for strong models against real business data: deliberate access, role-aware answers, and no bolt-on iframe chat duct-taped to the side.",
    rareFeatures: [
      "Business-grounded prompts instead of generic assistants",
      "Guardrailed exposure by role and intent",
      "Lives as a first-class route in the same product shell",
    ],
    whyMatters:
      "Useful AI fails fast when it cannot respect who is allowed to see what.",
    primaryMedia: { kind: "image", assetKey: "ai" },
    plannedMediaFallback:
      "Screenshot: conversation UI with safe demo data — `papion-module-ai.png`",
  },
  {
    id: "insights",
    label: "Insights",
    headline: "Steering panels where managers actually decide.",
    intro:
      "Performance, products, customers, branches, and finance-adjacent signals placed for operational hierarchy—live enough to feel like steering, not a monthly PDF.",
    rareFeatures: [
      "Layered analytics that mirror real branch structure",
      "Product and branch cuts that match Papion’s inventory map",
      "Finance signals next to sales—not stranded in another island",
    ],
    whyMatters:
      "Reporting only helps when it shows up at the moment of a decision.",
    primaryMedia: { kind: "image", assetKey: "insights" },
    plannedMediaFallback:
      "Screenshot: strongest insights view — `papion-module-insights.png`",
  },
]
