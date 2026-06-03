/** Match portfolio case studies: Barlow Condensed labels, Fraunces body. */
export const LUXIAN_DISPLAY_FONT = "'Barlow Condensed', sans-serif"
export const LUXIAN_BODY_FONT = "var(--font-drh-body)"

/** From `context-ai/works/luxian/assets-favicon_io/android-chrome-192x192.png`. */
export const LUXIAN_LOGO = "/assets/selected-works-logos/luxian-logo.png"
export const LUXIAN_VIDEO_HERO = "/assets/lap-animation-assets/luxian-lap.mp4"
export const LUXIAN_VIDEO_POSTER = "/assets/lap-animation-assets/luxian-lap.webp"

export const LUXIAN_TRY_URL = "https://luxian-three.vercel.app/"
export const LUXIAN_LOGIN_URL = "https://luxian-three.vercel.app/login"
export const LUXIAN_REPO_URL = "https://github.com/Ashraf-Swaidan/luxian"

/** Seeded admin — full back office on the public demo. */
export const LUXIAN_DEMO_ADMIN_EMAIL = "admin@demo.com"
export const LUXIAN_DEMO_ADMIN_PASSWORD = "Secret1!"

const LUXIAN_V = "/assets/luxian-page/luxian-videos"

export const LUXIAN_SCREENSHOTS = [
  {
    key: "gen-1",
    src: "/assets/luxian-page/gen-1.png",
    alt: "Luxian storefront, editorial homepage hero",
  },
  {
    key: "gen-2",
    src: "/assets/luxian-page/gen-2.png",
    alt: "Luxian product detail with recommendations",
  },
  {
    key: "gen-3",
    src: "/assets/luxian-page/gen-3.png",
    alt: "Luxian shop catalog grid",
  },
  {
    key: "gen-4",
    src: "/assets/luxian-page/gen-4.png",
    alt: "Luxian admin operations dashboard",
  },
  {
    key: "gen-5",
    src: "/assets/luxian-page/gen-5.png",
    alt: "Luxian admin homepage merchandising",
  },
] as const

export type LuxianFeatureMedia =
  | {
      type: "image"
      src: string
      alt: string
    }
  | {
      type: "video"
      src: string
      poster?: string
      alt: string
      caption?: string
      /** Vertical phone capture (e.g. iPhone 14). Default is landscape 16:9. */
      framing?: "landscape" | "portrait"
    }

export type LuxianFeatureSection = {
  body: string
  media?: readonly LuxianFeatureMedia[]
}

export type LuxianFeature = {
  id: string
  title: string
  summary: string
  /** When true, UI shows a Technical label (auth, API, security). */
  technical?: boolean
  /** Overview copy shown before intro media. */
  intro: string
  /** Videos or images directly under the intro. */
  introMedia?: readonly LuxianFeatureMedia[]
  /** Optional follow-up blocks (copy, then media). */
  sections?: readonly LuxianFeatureSection[]
  /** Simple features: one body + media list. */
  body?: string
  media?: readonly LuxianFeatureMedia[]
}

export const LUXIAN_FEATURES: readonly LuxianFeature[] = [
  {
    id: "editorial-homepage",
    title: "Editorial homepage",
    summary: "Merchandise the story, not just the SKU list.",
    intro:
      "Luxian treats the homepage as editorial infrastructure, not a fixed template. From admin, operators reshape the hero, section slots, imagery, and color tokens that shoppers see on the live storefront, without asking a developer to redeploy the Next app. Before anything goes live, they can preview the full homepage as shoppers will see it, then save when the story looks right.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/homepage-cms.mp4`,
        alt: "Editing Luxian homepage hero and a homepage section in admin",
      },
    ],
    sections: [
      {
        body:
          "Merchandising goes deeper than swapping photos. A homepage banner can point at a specific collection, carry its own CTA label, and stay wired to the products that should appear when a shopper follows it. The controls stay explicit so the story on the site and the story in admin never drift apart.",
        media: [
          {
            type: "video",
            src: `${LUXIAN_V}/homepage-banner.mp4`,
            alt: "Editing a homepage banner image, linked collection, and CTA in admin",
          },
        ],
      },
    ],
  },
  {
    id: "personalization",
    title: "On-site personalization",
    summary: "Recommendations from real browsing.",
    intro:
      "Anonymous visitor events (search, views, category and collection filters) feed scoring in the API. On the shop, a Recommended for you row reflects recent browsing on the device, without bolting on a third-party personalization SKU. It is lightweight, owned, and tied to how people actually move through the catalog.",
    media: [
      {
        type: "image",
        src: "/assets/luxian-page/luxian-personalization.png",
        alt: "Luxian shop with Recommended for you based on recent browsing",
      },
    ],
  },
  {
    id: "admin-insights",
    title: "Admin insights",
    summary: "Business signal, not just back-office edits.",
    intro:
      "Luxian is not only a place for operators to manage the catalog or retie how the storefront looks. Admins get meaningful insight into how the business is running day to day: revenue and profit, orders in flight, restock pressure, supplier activity, and ranked views across products and customers. The walkthrough below tours the insights dashboard from a general overview into module-level tabs by product, customer, sales, suppliers, and related slices of the operation.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/dashboard.mp4`,
        alt: "Browsing Luxian admin insights across overview, products, customers, sales, and suppliers",
      },
    ],
  },
  {
    id: "admin-staff-roles",
    title: "Admin staff roles",
    summary: "Hierarchy inside the back office.",
    intro:
      "Luxian role-based access is not a flat shopper versus admin split. Even within admin there is hierarchy: owners create staff roles, assign broad and granular permissions to each role, then create accounts and attach the fitting role at signup. The walkthrough below creates a staff user on a Designer preset that cannot open dashboard, suppliers, or other non-designer areas. Designers are meant to change product images and other non-sensitive merchandising detail, not run the whole operation.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/staff-1.mp4`,
        alt: "Creating a staff account and assigning a Designer role with limited admin access",
      },
    ],
    sections: [
      {
        body:
          "Roles go deeper than which modules appear in the nav. Permissions can target sensitive fields such as product cost read and write. The same Designer account from above can open a product to edit imagery and related fields yet never sees cost, and cannot try to change it. A full admin with cost permission still gets those inputs. Field-level gates keep finance data out of roles that only need the creative surface.",
        media: [
          {
            type: "video",
            src: `${LUXIAN_V}/staff-precision.mp4`,
            alt: "Designer product edit without cost fields versus admin with cost access",
          },
        ],
      },
    ],
  },
  {
    id: "suppliers-supply-chain",
    title: "Suppliers & supply chain",
    summary: "Inbound stock with a real pipeline.",
    intro:
      "Most e-commerce leaves operators restocking from a black box: edit the quantity and hope the number was right. Luxian is built for an actual product stock pipeline. You create suppliers, then raise supplier orders: pick products, choose the supplier, set quantities and the new cost, and submit. That is not an instant stock bump. New orders start on the way; the catalog does not change until the shipment is marked received, which restocks the lines and applies the updated cost in one coherent step.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/suppliers.mp4`,
        alt: "Creating a supplier, raising a supplier order, and receiving it to restock stock",
      },
    ],
    sections: [
      {
        body:
          "Restock awareness goes further than admin forms. SKUs that need restock can use a narrow, permission-aware API to learn whether a supplier order is already in flight. On the storefront, shoppers may see a More coming soon teaser when inbound stock is on the way, instead of a hard out-of-stock dead end.",
      },
    ],
  },
  {
    id: "ui-ux-details",
    title: "UI/UX details",
    summary: "Back office with the same care as the shop.",
    intro:
      "A frustration with most e-commerce admin is how classic and spreadsheet-driven it feels: dive into tables, open modal forms, hunt the right column, save, and hope you edited the right row. Luxian treats staff and shoppers with the same UI discipline. Editing a product is not a grid of fields. The admin product screen mirrors the buy experience: cover image, title, and the details you see on the storefront are the editable surface. Click the cover to swap it, click the title and type. Gallery work goes further: add multiple images, drag to reorder, and pick which image is the cover, all without leaving that product-first layout.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/edit-product.mp4`,
        alt: "Inline Luxian product edit with storefront-like layout, gallery reorder, and cover selection",
      },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    summary: "Curated groups that power the shop and homepage.",
    intro:
      "Collections are one of my favorite modules in Luxian. Shopify-inspired but owned end to end: create a collection, add products, and reorder how they appear on the shop browse experience. That ordering is not cosmetic. It is how the catalog tells a story on the listing page. Collections also feed homepage CMS sections. Instead of hand-picking SKUs for trending or latest blocks, operators point a section at a trending collection or a latest-products collection and let membership stay in sync as the catalog changes.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/collection-editing.mp4`,
        alt: "Creating a Luxian collection, adding products, and reordering them for the shop",
      },
    ],
  },
  {
    id: "responsive-view",
    title: "Responsive view",
    summary: "Mobile-first, not desktop shrunk down.",
    intro:
      "Luxian was built knowing most shoppers never touch a desktop cart. The storefront and admin are meant to feel native on a phone: open it on mobile and it reads like the product was designed for that screen first. The walkthrough below spans a wide slice of that mobile experience. We went past squeezing desktop layouts into breakpoints. Some flows were rethought for small screens, such as supplier order creation: instead of one cramped stage on mobile, operators pick the supplier and products first, then review lines in a second step to edit quantity and cost inside a sheet that stays easy to parse. Admins can jump into the site from anywhere without wishing they had a laptop.",
    introMedia: [
      {
        type: "video",
        src: `${LUXIAN_V}/mobile-view.mp4`,
        alt: "Luxian storefront and admin experiences on mobile, including multi-step supplier orders",
        framing: "portrait",
      },
    ],
  },
  {
    id: "secure-auth",
    title: "Secure auth",
    summary: "JWT sessions without trading away browser security.",
    technical: true,
    intro:
      "The NestJS API issues proper JWT access and refresh tokens, but Luxian does not park them in localStorage where any XSS script could read them. Tokens ride in HttpOnly cookies, which JavaScript on the page cannot touch. HttpOnly alone does not solve CSRF, so the auth stack also relies on SameSite secure cookies so cross-site request forgery against session endpoints stays out of the threat model we cared about when wiring login for both the storefront and admin.",
  },
]

export const LUXIAN_WHY_BUILD_COLUMNS = [
  {
    id: "overview",
    title: "Overview",
    description:
      "Most e-commerce sits between two limits. WordPress and Shopify are fast, but they flatten how a brand can look and be merchandised. Custom development can escape that, yet it often ends at catalog CRUD: change the SKU, not the homepage story, not who sees profit, not how inbound stock connects to the site. Luxian is the platform I wanted for a tropical clothing line: custom built for the brand, with CMS depth operators actually enjoy using.",
  },
  {
    id: "shoppers",
    title: "For shoppers",
    description:
      "The storefront is editorial first. Hero, mosaic, collections, trending, and color tokens come from settings, not hardcoded layout. Anonymous visitor events power lightweight recommendations on product detail. The full path is wired: browse, cart, checkout, orders, and favorites. Checkout validates and decrements stock in one transaction, so inventory never lags behind what sold.",
  },
  {
    id: "operators",
    title: "For operators",
    description:
      "Behind the scenes is an organized back office, not a thin admin panel. The dashboard surfaces revenue, profit, orders, customers, suppliers, and restock signals in one place. Staff roles (Manager, Designer, Stock Auditor) keep merchandising, finance, and stock work separated. Supplier inbound feeds a single stock ledger. Homepage merchandising goes deep: assets, copy, colors, banners, and collection wiring without redeploying the storefront.",
  },
] as const
