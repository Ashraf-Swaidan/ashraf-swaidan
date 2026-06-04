# SMARTAR — Portfolio mini use-case brief

**Purpose:** Source of truth for building `/works/smartar` on [ashraf-swaidan](https://ashraf-swaidan) portfolio. Another agent implements React; this doc is verified from the SMARTAR Shopify theme repo only — no invented features.

**Last verified:** Theme `SMARTAR Store` v2.0.0 · Live store `https://vxjspu-kw.myshopify.com/` · Storefront password `ashraf123` (portfolio Entry Pass).

---

## Refined carousel one-liner (optional tweak)

> A Shopify store on a custom OS 2.0 theme built for merchandising control—not a template reskin. A catalog-aware AI shopping assistant lives in the theme (beta); checkout, cart, and ops stay on Shopify.

**Contrast vs Luxian:** Luxian = owned stack (NestJS + Postgres + Next.js). SMARTAR = Shopify-native craft (Liquid theme + storefront AI); platform owns checkout/inventory.

---

# A) Project identity (verified from repo)

| Field | Detail |
|--------|--------|
| **Brand** | SMARTAR — demo commerce brand |
| **Vertical (theme copy)** | Smart home / premium tech (“Smart home, thoughtfully chosen”) |
| **Live catalog** | Merchant may add phones, etc. (e.g. iPhone handles in AI demos); CSV seed data is smart-home SKUs |
| **Target shopper** | Consumer browsing curated tech; portfolio visitor evaluating UX + AI |
| **Merchant context** | Shopify **development store** (`vxjspu-kw.myshopify.com`) for portfolio/demo — not a production merchant deployment |
| **Theme** | Custom **Online Store 2.0** theme (`theme/`), **not** a bought theme reskin — `theme_info.theme_name`: “SMARTAR Store” v2.0.0 |

### What makes the theme custom (specific)

- **27 section files** under `theme/sections/` — bespoke Liquid, not Dawn-with-tweaks only.
- **JSON templates** (`theme/templates/*.json`) compose pages in Admin without code deploys.
- **Homepage merchandising stack** (`templates/index.json`): `hero-banner` → `trust-features` → `collection-hero` → `featured-collection` → `collection-duo` → `editorial-collection` → second `featured-collection` (“Shop all”).
- **Collection experience:** `collection-banner`, `collection-product-grid` with breadcrumbs, product count, **filter drawer** + sort (`collection.filters`), `collection-filters` snippet.
- **Collections index:** `list-collections.json` + `main-list-collections` + `collection-card`.
- **Product PDP:** `main-product` — multi-image gallery, variant picker, badges, JSON-LD via `snippets/seo-schema.liquid`.
- **Global chrome:** `header` (search drawer, cart, account, favorites, AI toggle), `announcement-bar`, `footer`, `cart-drawer`, `favorites-drawer` (localStorage wishlist), optional `page.wishlist.json`.
- **Tag-driven merchandising:** `snippets/product-badges.liquid` — `badge:new`, `badge:sale`, `badge:ai-pick`, optional `custom.highlight` metafield.
- **Theme settings** (`config/settings_schema.json`): brand colors, product JSON-LD toggle, **AI assistant** block (enable, Pollinations key, model, welcome, launcher label).
- **Analytics hooks:** `assets/analytics-events.js` — `trackStoreEvent()` + `data-analytics` clicks (GA4-ready, console debug in demo).

### Shopify platform features used

- Standard **Shopify Checkout** (hosted) — theme does not implement payments.
- **OS 2.0** sections everywhere; **customer account** templates under `templates/customers/`.
- **Collection filtering/sorting** via Liquid `collection.filters` (requires filters configured in Admin / Search & Discovery).
- **Shopify product recommendations API** in `ai-recommendations.js` (`/recommendations/products.json`) — section exists but is **not** in default `index.json` / `product.json`; merchant adds via Customize.
- **Dev store** — no Shopify Plus–only features claimed in code.

---

# B) AI integration (beta — precise)

### What the AI does for the shopper (shipped in theme)

**Store assistant chat** (`sections/ai-chat-widget.liquid` + `assets/ai-chat.js`):

- Sidebar chat UI: “Store assistant” (`locales`: `sections.ai_chat.title`).
- **Catalog-aware:** On each page load, Liquid injects JSON (`data-ai-catalog`) — up to **100 products** from `collections.all.products` + all **collections** (excl. `frontpage`).
- **System prompt** built in JS from that catalog (handles, titles, prices, types, tags, availability) — model must only recommend real handles.
- **Pollinations API:** `POST https://gen.pollinations.ai/v1/chat/completions` (OpenAI-compatible). Model from theme settings (default `qwen-coder`).
- **Rich widgets** parsed from model output and rendered in-chat:
  - `:::product handle:::` — image, price, View, Add to cart (`/cart/add.js`)
  - `:::collection handle:::` — banner, title, count, “Shop collection”
  - `:::compare h1,h2:::` — side-by-side cards + spec table (price, type, tags, status)
  - `:::products h1,h2,h3:::` — list rows (2 handles → compare layout)
- **Markdown** in replies: bold, lists, links, `###` headings, pipe tables (compare widget preferred over tables).
- **Page context:** On product pages, `data-page-product` / handle passed into prompt.
- **Disclaimer in UI:** “AI picks from our real catalog. Checkout stays on Shopify.”

### Where it appears in the UI

- **Global:** Section rendered in `layout/theme.liquid` on every page (when enabled).
- **Entry points:** Floating **“Ask AI”** pill (bottom-right, ✦ icon) + **header** ✦ button (`data-ai-chat-toggle`). Mobile: AI in header bar; favorites moved to menu per `header.liquid` / `header.js`.
- **Not** a separate Shopify App embed — theme-native section + assets.

### Models / APIs / services

| Piece | Role |
|--------|------|
| **Pollinations** (`gen.pollinations.ai`) | Live chat LLM (browser `fetch` + Bearer key from theme settings) |
| **Shopify Liquid** | Catalog JSON injection |
| **Shopify Cart API** | Add to cart from widgets |
| **`apps/ai-tagging-service` (Nest)** | **Not wired to live storefront** — rule-based demo for `POST /tagging/suggest` + mock chat; README mentions deprecated `ai_api_base_url` (not in current `settings_schema.json`) |

### Data sources

- **In chat:** Injected product/collection catalog (title, price, image URL, tags, type, variant id, URLs). No live Admin API refresh.
- **Not used by chat:** Customer login state, order history, cart contents, inventory counts beyond `available` boolean in catalog snapshot.
- **AI recommendations section** (optional): Shopify `/recommendations/products.json` on product pages; “insight” text is **rule-based in JS** (tags like `badge:ai-pick`), not an LLM — label says “Personalized with AI”.

### Beta limitations (honest)

- API key in **theme settings → exposed in browser** (demo/portfolio only).
- Catalog capped at **100 products**; stale until page reload.
- Model may miss widget directive format occasionally; parser accepts `handle:` alias as fallback.
- **No** server proxy, rate limiting, or PII-safe logging.
- **No** vision / image upload, voice, or streaming replies (non-streaming `fetch` today).
- **No** guaranteed order/shipping/stock answers — prompt forbids inventing ops data.
- **Nest tagging service** not connected to storefront — do not show as live feature on store URL.
- **AI recommendations** section not on default homepage/product template in repo JSON — optional add in Customize.
- Checkout on dev store may need Admin shipping/payment setup for full order flow (see `data/DEMO_CHECKOUT_PAYMENTS.md`).

### Suggested “Beta” callout copy (portfolio)

> **AI shopping assistant (beta)** — Built into the theme, not a bolt-on app. The assistant reads a snapshot of the real product catalog and renders product, collection, and compare cards in the chat. API calls run from the browser for this demo; production would move keys and inference behind a server proxy.

---

# C) Narrative spine (mini use-case sections)

Use Duwit-style numbered steps. Voice: first person (Ashraf), outcome-led, Fraunces body on portfolio.

---

### 01 — Opening

**Headline:** SMARTAR — Shopify commerce with the AI in the theme, not beside it.

**Body:**  
I built SMARTAR to show how far a **custom OS 2.0 theme** can go on Shopify without giving up the platform: merchandising blocks, collection tooling, and a **catalog-aware assistant** that renders real product cards in the conversation. Checkout and operations stay on Shopify; the differentiation is how the storefront looks, sells, and guides.

**Pills:** Shopify · AI Powered · Custom theme

---

### 02 — Friction

**Headline:** Generic themes and disconnected AI apps don’t carry the brand.

**Body:**  
Off-the-shelf themes force merchants into the same hero-and-grid rhythm. Bolt-on chat apps sit in iframes, don’t know the catalog, and can’t render **Add to cart** or **compare** UI from live handles. Shoppers get text walls; merchants get another admin silo. I wanted one **brand-owned surface** where merchandising and assistance share the same product data.

**Vibe pills (optional):** Template sameness · Chat in a box · No real widgets · Ops still on Shopify anyway

---

### 03 — Storefront / theme craft

**Headline:** Merchandising control without leaving Shopify.

**Body:**  
The homepage is a **stack of purpose-built sections**—hero, trust strip, collection hero, dual collection promo, editorial row, and full catalog grid—not a single “featured collection” dump. Collection pages get toolbar, filters, and sort. Product pages use tag-driven badges and JSON-LD. Favorites persist in the browser with a drawer; cart is a drawer too. Everything is editable in the theme editor via JSON templates.

**Sub-bullets:**
- Tag badges: New, Sale, Top pick (`badge:ai-pick`)
- Mobile-first header with search, cart, account, AI entry
- SEO: optional product schema in theme settings

---

### 04 — AI experience (beta)

**Headline:** Ask the store; get cards, not paragraphs.

**Body:**  
The assistant pulls catalog JSON on load and calls **Pollinations** from the theme. When I ask for a phone in a budget range or a comparison between two models, it should answer with short copy plus **directives** the theme turns into widgets—product cards with **Add to cart**, collection banners, or a **compare** layout with a spec table from real prices and tags. The ✦ control lives in the header and as a floating **Ask AI** pill so discovery isn’t buried.

**Try on live store (after Entry Pass):**
1. Open **Ask AI** (header or bottom-right).
2. “Recommend a phone between £500 and £1000.”
3. “Compare iPhone 15 Pro vs iPhone 17 Pro.”
4. “Show me the featured collection.”

**Sub-bullets:** Catalog snapshot · Widget directives · Compare table · Collection card

---

### 05 — Outcome

**Headline:** Platform-native shop, product-grade UX, AI you can demo in one URL.

**Body:**  
SMARTAR is the counterpoint to my **Luxian** build: there I own the full stack; here I stayed on Shopify and invested in **theme + integrated AI**. For recruiters, the live store proves Liquid craft, OS 2.0 architecture, and a believable **beta** assistant—not a mockup screenshot. Next step for production: proxy the LLM, sync catalog server-side, and graduate beta without changing the shopper-facing pattern.

---

### Live demo block (between Hero and Friction — Duwit pattern)

**Headline:** Walk the store.

**Body:**  
Use the embedded device demo with `https://vxjspu-kw.myshopify.com/`. Enter password **`ashraf123`** when prompted (Entry Pass on portfolio hero).

**CTA:** Visit store (primary)

---

# D) Asset map (5 screenshots + 1 video)

Place under portfolio repo:

```text
public/assets/smartar-page/
  SMARTAR-logo.png
  smartar-screenshots/
    gen-1.webp … gen-5.webp
  smartar-ai-experience.mp4
public/assets/lap-animation-assets/
  Smartar-lap.mp4          (carousel — exists)
  smartar-lap.webp         (laptop poster — still needed)
```

| File | Section | What to capture | Alt text | Caption |
|------|---------|-----------------|----------|---------|
| `gen-1.webp` | 03 Storefront | Homepage above the fold: hero, trust strip, start of collection hero / featured grid | SMARTAR homepage with hero headline and featured merchandising sections | A homepage built from stacked sections—not one generic featured grid. |
| `gen-2.webp` | 03 Storefront | Collection page: banner, breadcrumb, toolbar (count, filter, sort), product grid | SMARTAR collection page with filters and sort toolbar | Collection browsing with filters and sort wired in the theme. |
| `gen-3.webp` | 03 Storefront | Product page: gallery, badges (New / Sale / Top pick), price, add to cart | SMARTAR product page with tag-driven badges and gallery | Product detail with tag-driven badges and structured product layout. |
| `gen-4.webp` | 04 AI (beta) | Chat open: user question + **product widget** (image, price, View, Add to cart) | SMARTAR AI assistant showing an in-chat product card | The assistant renders real product cards from catalog handles—not text-only links. |
| `gen-5.webp` | 04 AI (beta) | **Compare widget** (two columns + spec table) or collection widget with “Shop collection” | SMARTAR AI compare or collection widget inside the chat panel | Compare and collection layouts rendered inside the chat from store data. |
| `smartar-ai-experience.mp4` | 04 AI (beta) / Hero | Screen recording: open Ask AI → ask budget/compare → widgets appear → optional Add to cart | Screen recording of SMARTAR beta AI shopping assistant on the live Shopify store | Watch the beta assistant answer with in-chat product and compare widgets. |

**Capture tips:** Use live URL at desktop width; include floating **Ask AI** in at least one frame; mobile optional as 6th asset later. Hide dev-only Shopify admin bars. Password gate should appear only at start of video if recording from cold visit.

---

# E) Hero & CTAs

| Field | Copy |
|--------|------|
| **Hero title** | SMARTAR |
| **Hero subtitle** | Custom Shopify theme for serious merchandising—and an AI shopping assistant woven into the journey (beta). |
| **Primary CTA** | Visit store → `https://vxjspu-kw.myshopify.com/` |
| **Entry Pass note** | Store password: `ashraf123` (glowing pill beside tags) |
| **Secondary** | Read use case (enabled when page ships) |
| **Meta description (~155 chars)** | SMARTAR: custom Shopify OS 2.0 theme with catalog-aware AI chat, compare widgets, and brand-owned merchandising—checkout stays on Shopify. Live demo. |

**Positioning one-liner (hero/supporting):**  
Custom Shopify theme for merchandising control, with AI in the shopping journey—not a template reskin and not a disconnected AI app.

---

# F) Technical highlights (one “system” block — not a stack dump)

**Theme architecture**

- Online Store **2.0**: JSON templates + section schemas; global `ai-chat-widget` + drawers in `theme.liquid`.
- Liquid injects **catalog JSON**; JS owns chat UX, directive parsing, markdown/tables, widget DOM.
- Deferred JS: `global.js`, `wishlist.js`, `header.js`, `ai-chat.js`, template-conditional CSS.
- Mobile: header drawer portaled to `document.body` (`header.js`) to avoid scroll clipping.

**AI wiring (high level)**

```text
Page load → Liquid builds catalog JSON
         → Shopper opens chat → JS system prompt + Pollinations API
         → Model returns text + :::directives:::
         → JS renders widgets → Shopify cart/collection URLs
```

**Tradeoffs**

- Browser-side API key = fast portfolio demo, not production security.
- Catalog snapshot (100 products) = simple, may drift from Admin until reload.
- Pollinations model in settings = easy swap; quality varies by model (default `qwen-coder` is code-biased).

---

# G) Honest scope notes

| Status | What |
|--------|------|
| **Production-quality in theme** | Custom sections, collection UX, PDP, badges, cart/favorites drawers, SEO schema toggle, analytics hooks |
| **Beta on live demo** | Pollinations chat, widget rendering, client-side API key |
| **In repo, not on default templates** | `ai-recommendations` section (Shopify recommendations + rule-based copy) |
| **In repo, not connected to storefront** | `apps/ai-tagging-service` Nest demo |
| **Planned / not shipped** | Server proxy for AI, secure keys, catalog sync job, streaming, customer-aware chat, vision |
| **Do not claim** | “Full AI personalization” sitewide; Nest-powered live chat; real-time inventory from AI; production payment setup on dev store unless configured; metrics (“+30% conversion”) |

**README drift:** `README.md` still mentions `ai_api_base_url` for chat — **outdated**; live chat uses Pollinations in `ai-chat.js` only.

---

# H) Recommended sibling works (footer)

| Project | Why pair it |
|---------|-------------|
| **Duwit** | Closest portfolio shape—hero, live try, friction story, screenshot collage; both are **AI product** narratives. |
| **Luxian** | Strong contrast—full-stack owned commerce vs **Shopify-native** SMARTAR; shows range across platforms. |

*Alternative:* Papion System — ops platform, different domain, if you want non-commerce variety instead of Luxian.

---

# I) Implementation hints (portfolio agent)

### Files to create (mirror Duwit)

| File | Role |
|------|------|
| `src/pages/SmartarPage.tsx` | Page shell, GSAP reveals, `prefers-reduced-motion` |
| `src/pages/smartar/smartar-data.ts` | Copy, asset paths, CTAs, step labels |
| `src/pages/smartar/smartar-sections.tsx` | Section components |
| `src/pages/smartar/SmartarScreenshotCollage.tsx` | 5-up grid like Duwit |

### Route

- Register **`/works/smartar`** in `App.tsx`.
- `selectedWorks` slug/id: **`smartar`**.

### When page ships

- In `src/data/selectedWorks.ts`: set **`caseStudyComingSoon: false`** for SMARTAR.
- Enable **Read Use Case** on carousel card.

### Design system (do not invent)

- Labels: **Barlow Condensed**
- Body: **Fraunces** (`var(--font-drh-body)`)
- Tokens: `--color-drh-bg`, `--color-drh-ink`, `--color-drh-accent-orange`
- Components: reuse **WorkLiveDeviceDemo** with Shopify URL + password note
- Animations: GSAP scroll reveals + reduced-motion off switch

### Section order (suggested)

1. Hero (logo, wordmark, `Smartar-lap.mp4` or poster, pills, Entry Pass, CTA)
2. Live demo embed
3. 01 Opening (narrative)
4. 02 Friction
5. 03 Storefront + screenshot collage (gens 1–3)
6. 04 AI beta + `smartar-ai-experience.mp4` + gens 4–5
7. 05 Outcome
8. Footer — recommended works (Duwit + Luxian)

### Reference files in portfolio repo

- `src/pages/DuwitPage.tsx`
- `src/pages/duwit/duwit-data.ts`
- `src/pages/duwit/duwit-sections.tsx`
- `src/pages/duwit/DuwitScreenshotCollage.tsx`

---

## Repo pointers (for maintainers)

| Topic | Path |
|--------|------|
| AI chat | `theme/sections/ai-chat-widget.liquid`, `theme/assets/ai-chat.js` |
| AI settings | `theme/config/settings_schema.json` |
| Homepage layout | `theme/templates/index.json` |
| Public store checklist | `data/PORTFOLIO_PUBLIC_STORE.md` |
| AI setup | `data/AI_ASSISTANT_SETUP.md` |
| Nest demo (not live) | `apps/ai-tagging-service/` |

---

*Copy this file into the portfolio repo or link to it from `context-ai/` when implementing `/works/smartar`.*
