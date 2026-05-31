/** Typography tokens for Papion case-study pages. */
export const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const BODY_FONT = "var(--font-drh-body)"

/** Public hero loop — swap for `papion-hero-proof.mp4` when ready. */
export const PAPION_VIDEO_HERO = "/assets/lap-animation-assets/papion.mp4"
/** Optional order-flow clip; falls back to hero if missing. */
export const PAPION_ORDER_SPINE_VIDEO =
  "/assets/lap-animation-assets/papion-workflow-order.mp4"

/** Module-explorer screen recordings under `public/assets/papion-page/papion-videos/`. */
const papionExplorerVideo = (filename: string) =>
  `/assets/papion-page/papion-videos/${filename}`

export const PAPION_LOGO = "/assets/selected-works-logos/papion-logo.svg"
/** In-page anchor for module explorer (hero CTA smooth-scroll). */
export const PAPION_MODULE_EXPLORER_ID = "papion-module-explorer"
export const EXCEL_ICON_SRC = "/assets/excel.svg"

export const EXCEL_FOOTNOTE =
  "I know Excel can do absolutely anything if you're crazy enough to dive into that deep hole. But hey — we're not fans of countless cells."

/** Shown after inline “Papion” + logo in the friction animation. */
export const FRICTION_LINE1_TAIL = ' is not "a few tabs of data." It is'

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
  /** Poster / sample still for expense receipt upload clip */
  receiptSample:
    "/assets/papion-page/papion-screenshots/reciept-sample.webp",
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
      /** `landscape` 16:9, `portrait` phone-tall, `tablet` ~4:3 (iPad-style). */
      videoFraming?: "landscape" | "portrait" | "tablet"
    }

/** Shared fields for expandable “uncommon beat” panels. */
type ExplorerFeatureSpotlightBase = {
  id: string
  title: string
  /** One line when the panel is collapsed */
  teaser: string
  body: readonly string[]
  /** Vibrant pastel stripe; AI beats use a multi-stop gradient instead */
  aiPowered?: boolean
}

/** Expandable “uncommon beat” with in-panel copy; optional media on the right when expanded. */
export type ExplorerFeatureSpotlight =
  | (ExplorerFeatureSpotlightBase & {
      primaryMedia: ExplorerPrimaryMedia
      plannedMediaFallback: string
      /** Mini attachment card; opens full image (e.g. receipt vs video) */
      demoAttachment?: {
        assetKey: keyof typeof CASE_ASSETS
        label: string
        imageAlt: string
      }
    })
  | ExplorerFeatureSpotlightBase

export type ExplorerModuleEntry = {
  id: ExplorerModuleId
  label: string
  headline: string
  intro: string
  /** Short pills; shown below collapsible spotlights when both exist */
  rareFeatures: readonly string[]
  whyMatters: string
  primaryMedia: ExplorerPrimaryMedia
  plannedMediaFallback: string
  /** Optional collapsible feature deep-dives (full-width below the main grid) */
  featureSpotlights?: readonly ExplorerFeatureSpotlight[]
}

export const MODULE_EXPLORER_ENTRIES: ExplorerModuleEntry[] = [
  {
    id: "sales",
    label: "Sales",
    headline: "One sales surface that reaches across inventories, payments, and follow-up.",
    intro:
      "Create orders from eight inventory domains in a single flow. Choose order type—instant, due date, or event. Pick customers quickly, scan barcodes when the counter is busy, take partial payment, and track what is still unpaid in its own place. Tasks sit beside the work, and sales insights go deep enough to steer without exporting.",
    rareFeatures: [
      "Eight inventories in one order flow",
      "AI order prefill from text or voice",
      "Instant / due-date / event order types",
      "Partial pay, unpaid area, tasks, and deep sales insights",
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
    featureSpotlights: [
      {
        id: "order-ai-prefill",
        title: "AI order prefill",
        aiPowered: true,
        teaser:
          "Say or type what you sold and to whom — AI maps customer, lines, and payment into a ready order.",
        body: [
          "After a walk-in or phone sale, staff should not rebuild the cart field by field. Tell Papion what you sold and to whom — in text or by voice — and the AI extracts customer, products, quantities, and payment context, then lays out a full order you can review and submit.",
          "It turns spoken shorthand into structured lines: fewer taps on busy shifts, less retyping from notes, and a faster path from conversation to confirmed order.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("prefill-order-form.mp4"),
          posterAssetKey: "sales",
        },
        plannedMediaFallback:
          "Clip: AI order prefill from text or voice (`prefill-order-form.mp4`)",
      },
      {
        id: "order-drafts",
        title: "Order drafts",
        teaser:
          "Long order in progress? Save the cart—or reload the customer’s last draft—instead of starting over.",
        body: [
          "Big orders get interrupted: a phone call, a shift change, a crash. Drafts let you save the in-progress order and bring it back later, or load the customer’s previous order instance so you are not retyping lines from memory.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("order-load-draft.mp4"),
          posterAssetKey: "sales",
        },
        plannedMediaFallback:
          "Clip: save or load an order draft (`order-load-draft.mp4`)",
      },
      {
        id: "bulk-pay-unpaid",
        title: "Bulk repay a customer's unpaid orders",
        teaser:
          "Filter unpaid orders by customer, then mark all of that customer's debt as fully paid in one action.",
        body: [
          "When a customer returns to clear old debt, staff should not open and settle every order one by one. In the unpaid section, filter by customer to isolate only their outstanding orders, then run a bulk action to mark the full set as paid.",
          "It is fast, less error-prone, and keeps debt recovery practical during busy shifts.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("bulk-pay-order.mp4"),
          posterAssetKey: "sales",
        },
        plannedMediaFallback:
          "Clip: filter unpaid by customer and bulk repay (`bulk-pay-order.mp4`)",
      },
      {
        id: "order-calendar-agenda",
        title: "Calendar and agenda for due-date orders",
        teaser:
          "Due-date orders land in a calendar/agenda view so teams can plan ahead and not miss critical deliveries.",
        body: [
          "Orders with due dates are surfaced in a calendar and agenda timeline that fits daily operations. Teams can scan upcoming commitments, spot pressure days early, and coordinate workload before deadlines become emergencies.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("order-calendar-agenda.mp4"),
          posterAssetKey: "sales",
        },
        plannedMediaFallback:
          "Clip: due-date order calendar and agenda (`order-calendar-agenda.mp4`)",
      },
    ],
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
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("inventory-video.mp4"),
      posterAssetKey: "inventory",
    },
    plannedMediaFallback:
      "Screenshot: category landing or grid — `papion-module-inventory.png`",
    featureSpotlights: [
      {
        id: "stands-3d",
        title: "Stands: photo plus a lightweight 3D preview",
        teaser:
          "Each stand carries a flat image and a compressed 3D model—upload your own or generate from the photo with image-to-3D.",
        body: [
          "Stands are visual products: a thumbnail is not always enough. The stands domain stores a reference image and a compressed 3D asset so the item reads clearly in the UI. Bring your own GLB (or equivalent) if you already have one, or run image-to-3D to build a small, upload-ready model from the stand photo and attach it in the same record.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("3D-model-stands.mp4"),
          posterAssetKey: "inventory",
        },
        plannedMediaFallback:
          "Clip: stand image and 3D model flow (`3D-model-stands.mp4`)",
      },
      {
        id: "inventory-export",
        title: "Filtered exports: Excel, barcodes, and a print PDF",
        teaser:
          "Whatever is on screen after your filters—export it to Excel, backfill missing barcodes, or print a barcode sheet in one step.",
        body: [
          "The list you see is the list you act on. Narrow by category or any other criteria, then use a single control to download an Excel workbook of those rows when someone still wants to work in a spreadsheet.",
          "From the same scoped set, another action assigns barcodes to every item that is missing one. A third produces a PDF of those barcodes, laid out for printing—so label runs match the subset you filtered, not the entire catalog by mistake.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("inventory-export.mp4"),
          posterAssetKey: "inventory",
        },
        plannedMediaFallback:
          "Clip: inventory export, barcode generation, barcode PDF (`inventory-export.mp4`)",
      },
    ],
  },
  {
    id: "expenses",
    label: "Expenses",
    headline: "Operating spend with branch and personal context.",
    intro:
      "Beyond supplier COGS: everyday outflows, attribution, and wallet-backed payments stay tied to what actually left the business. Type as usual, upload a receipt for AI prefill, or add an expense by voice when your hands are full.",
    rareFeatures: [
      "Recurring and one-off templates where teams feel them",
      "Branch vs business vs personal classification",
      "Reads next to revenue without exporting to another tool",
    ],
    whyMatters:
      "Margins get argued every week. Expenses belong in the same narrative as sales.",
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("expense-video.mp4"),
      posterAssetKey: "expenses",
    },
    plannedMediaFallback:
      "Screenshot: expense table or recurring row — `papion-module-expenses.png`",
    featureSpotlights: [
      {
        id: "receipt-ai",
        title: "Receipt upload and AI prefill",
        aiPowered: true,
        teaser:
          "Skip typing every field. Upload a receipt and let AI fill the form.",
        body: [
          "Instead of having to fill every single field, let AI handle it for you. Upload a receipt, and watch AI prefill them into the form.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("expense-image-reciept.mp4"),
          posterAssetKey: "receiptSample",
          videoFraming: "tablet",
        },
        plannedMediaFallback:
          "Clip: receipt upload and AI prefill (`expense-image-reciept.mp4`)",
        demoAttachment: {
          assetKey: "receiptSample",
          label: "Attachment used",
          imageAlt:
            "Receipt image used in this demo. Compare it with the recording to verify amounts and merchant details.",
        },
      },
      {
        id: "voice-ar",
        title: "Voice entry",
        teaser:
          "Say it in Arabic or English, tweak anything you need, then save when it looks right.",
        body: [
          "Add an expense by talking through merchant, amount, and short notes. Arabic and English work in the same flow, and you always approve before anything is saved.",
        ],
      },
    ],
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
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("supplier-video.mp4"),
      posterAssetKey: "suppliers",
    },
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
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("customers-video.mp4"),
      posterAssetKey: "customers",
    },
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
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("wallets-video.mp4"),
      posterAssetKey: "wallets",
      videoFraming: "portrait",
    },
    plannedMediaFallback:
      "Screenshot: wallets or transfer UI — `papion-module-wallets.png`",
    featureSpotlights: [
      {
        id: "unify-loans",
        title: "Unify similar loans",
        teaser:
          "Several small loans to the same counterparty or for the same purpose? Roll them into one clean balance instead of a pile of duplicates.",
        body: [
          "Over time, similar IOUs stack up: same person, same kind of arrangement, different dates. Papion can merge those loan records into a single loan so the ledger stays readable and payments apply to one place.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("unifying-loans.mp4"),
          posterAssetKey: "wallets",
          videoFraming: "portrait",
        },
        plannedMediaFallback:
          "Clip: merging loans into one (`unifying-loans.mp4`)",
      },
      {
        id: "loan-offset-shortcut",
        title: "Shortcut: net out opposing loans",
        teaser:
          "When two loans effectively cancel each other, use the shortcut to clear the pair instead of paying each line by hand.",
        body: [
          "Sometimes money owed runs both ways at once—two entries that should wash out. A dedicated shortcut closes those offsetting loans in one move so you are not shuffling artificial payments between the same parties.",
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    headline:
      "The AI hub—mockups, prefills, and guarded chat in one deliberate route.",
    intro:
      "Papion treats AI as a first-class product area, not a sidebar widget. Generate on-brand mockup images for whole slices of inventory, let models prefill sales orders and expense forms from natural input, and converse against business data with the same role boundaries as everywhere else.",
    rareFeatures: [
      "Bulk product mockups with a locked visual strategy",
      "AI order prefill from text or voice",
      "Receipt upload and AI expense prefill",
      "Guardrailed chat on a first-class route—not a bolt-on iframe",
    ],
    whyMatters:
      "Useful AI fails fast when it cannot respect who is allowed to see what—and when batch work skips a quality gate.",
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("AI-video.mp4"),
      posterAssetKey: "ai",
    },
    plannedMediaFallback:
      "Screenshot: conversation UI with safe demo data — `papion-module-ai.png`",
    featureSpotlights: [
      {
        id: "bulk-mockup-generation",
        title: "Bulk product mockup images",
        aiPowered: true,
        teaser:
          "Select catalog items, lock a mockup style with AI, approve one sample, then generate images for the whole batch.",
        body: [
          "Preparing mockup images for a large catalog is slow when you work SKU by SKU. This pipeline uses AI to generate mockup images for your inventory items in bulk, at the quality you set.",
          "Step 1: Select inventory items.",
          "Step 2: Discuss and lock a mockup style strategy with Papion AI.",
          "Step 3: Generate one test image and approve it when it looks right.",
          "Step 4: Press generate to create a matching mockup for every selected item, using the approved test sample as the reference.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("mockup-ai-video.mp4"),
          posterAssetKey: "inventory",
        },
        plannedMediaFallback:
          "Clip: bulk product mockup generation (`mockup-ai-video.mp4`)",
      },
      {
        id: "ai-order-prefill",
        title: "AI order prefill",
        aiPowered: true,
        teaser:
          "Say or type what you sold and to whom — AI maps customer, lines, and payment into a ready order.",
        body: [
          "After a walk-in or phone sale, staff should not rebuild the cart field by field. Tell Papion what you sold and to whom — in text or by voice — and the AI extracts customer, products, quantities, and payment context, then lays out a full order you can review and submit.",
          "It turns spoken shorthand into structured lines: fewer taps on busy shifts, less retyping from notes, and a faster path from conversation to confirmed order.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("prefill-order-form.mp4"),
          posterAssetKey: "sales",
        },
        plannedMediaFallback:
          "Clip: AI order prefill from text or voice (`prefill-order-form.mp4`)",
      },
      {
        id: "ai-receipt-prefill",
        title: "Receipt upload and AI prefill",
        aiPowered: true,
        teaser:
          "Skip typing every field. Upload a receipt and let AI fill the form.",
        body: [
          "Instead of filling every expense field by hand, upload a receipt and let Papion AI read merchant, amounts, and line context into the form. Review, tweak anything that needs a human eye, then save.",
        ],
        primaryMedia: {
          kind: "video",
          src: papionExplorerVideo("expense-image-reciept.mp4"),
          posterAssetKey: "receiptSample",
          videoFraming: "tablet",
        },
        plannedMediaFallback:
          "Clip: receipt upload and AI prefill (`expense-image-reciept.mp4`)",
        demoAttachment: {
          assetKey: "receiptSample",
          label: "Attachment used",
          imageAlt:
            "Receipt image used in this demo. Compare it with the recording to verify amounts and merchant details.",
        },
      },
    ],
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
    primaryMedia: {
      kind: "video",
      src: papionExplorerVideo("insights-video.mp4"),
      posterAssetKey: "insights",
    },
    plannedMediaFallback:
      "Clip or screenshot: insights overview — `insights-video.mp4` / `papion-module-insights.png`",
  },
]
