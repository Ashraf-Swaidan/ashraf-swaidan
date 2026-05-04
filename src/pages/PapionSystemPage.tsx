import { OneSystemFlow } from "@/components/landing/one-system-flow/OneSystemFlow"

const DISPLAY_FONT = "'Barlow Condensed', sans-serif"
const BODY_FONT = "var(--font-drh-body)"

const PAPION_VIDEO = "/assets/lap-animation-assets/papion.mp4"
const PAPION_LOGO = "/assets/selected-works-logos/papion-logo.svg"

const MODULES = [
  {
    name: "Sales",
    signal: "Execution core",
    body: "Orders, drafts, unpaid revenue risk, branch intelligence, and analytics live in the same operational surface.",
    capture: "Sales orders table, unpaid orders, statistics, or insights.",
  },
  {
    name: "Inventory",
    signal: "Production structure",
    body: "Category-first inventory models real event/decor production: basic, choco, laser, print, flex, balloons, helium, and stands.",
    capture: "Visual category grid or category management screen.",
  },
  {
    name: "Customers",
    signal: "Growth lens",
    body: "Customer records become live intelligence, with retail/wholesale segmentation, search, exports, and profile-level analytics.",
    capture: "Customer list with stats/search/filter or profile analytics.",
  },
  {
    name: "Suppliers",
    signal: "Procurement clarity",
    body: "Supplier records connect directly to COGS-aware expense flows and spend concentration insight.",
    capture: "Supplier table, COGS expense table, or supplier spend chart.",
  },
  {
    name: "Expenses",
    signal: "Cost control",
    body: "One-time and recurring expenses, wallet-linked payment behavior, branch context, filters, and finance insight.",
    capture: "Expense table, recurring templates, or branch/payment context.",
  },
  {
    name: "Wallets",
    signal: "Treasury layer",
    body: "Deposits, withdrawals, transfers, balances, loans, branch-aware wallets, and readable transaction history.",
    capture:
      "Wallet cards, transaction list, transfer modal, branch wallets, or loans.",
  },
]

const WORKFLOWS = [
  {
    title: "Order to control",
    body: "Show a sales order being inspected or created, with the outcome visible before the recording ends.",
    duration: "5-10s",
  },
  {
    title: "Expense to wallet",
    body: "Show an expense/payment flow that makes cash movement feel governed instead of manually reconciled later.",
    duration: "5-10s",
  },
  {
    title: "Customer to decision",
    body: "Show search, filtering, export, print, or profile intelligence helping a user act faster.",
    duration: "5-10s",
  },
]

const CAPTURE_QUEUE = [
  "Hero proof recording: 20-35s at 1920x1080.",
  "One strong desktop screenshot for each major module.",
  "Three focused workflow recordings, 5-10s each.",
  "One finance-control recording around wallets and transactions.",
  "Responsive proof: one module captured at desktop, tablet, and mobile widths.",
]

function Eyebrow({ children }: { children: string }) {
  return (
    <p
      className="text-[0.7rem] font-semibold tracking-[0.28em] text-[var(--color-drh-ink)]/42 uppercase"
      style={{ fontFamily: DISPLAY_FONT }}
    >
      {children}
    </p>
  )
}

function MediaPlaceholder({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] bg-[var(--color-drh-ink)] text-white shadow-[0_28px_68px_rgb(10_10_10/0.14)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(255 255 255 / 0.16) 1px, transparent 1px), linear-gradient(180deg, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>
      <div className="relative z-10 p-4 sm:p-5">
        <p
          className="mb-4 text-[0.68rem] tracking-[0.24em] text-white/48 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {label}
        </p>
        {children}
      </div>
    </div>
  )
}

export function PapionSystemPage() {
  return (
    <main className="min-h-svh bg-[var(--color-drh-bg)] text-[var(--color-drh-ink)]">
      <section className="relative isolate overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(10 10 10 / 0.45) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.32) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-[96rem] grid-rows-[auto_1fr] gap-8">
          <header className="flex items-center justify-between gap-4">
            <a
              href="/"
              className="text-[0.76rem] font-semibold tracking-[0.2em] text-[var(--color-drh-ink)]/48 uppercase transition hover:text-[var(--color-drh-ink)]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Back to portfolio
            </a>
            <img
              src={PAPION_LOGO}
              alt="Papion"
              className="h-10 w-10 object-contain"
            />
          </header>

          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-[45rem]">
              <Eyebrow>Project showcase / Papion System</Eyebrow>
              <h1
                className="mt-6 text-[clamp(4.2rem,13vw,11rem)] leading-[0.78] font-semibold tracking-[-0.035em] uppercase"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                Business operating system.
              </h1>
              <p
                className="mt-7 max-w-[34rem] text-[clamp(1.05rem,1.55vw,1.35rem)] leading-[1.6] text-[var(--color-drh-ink)]/62"
                style={{
                  fontFamily: BODY_FONT,
                  fontVariationSettings: '"opsz" 64, "wght" 420',
                }}
              >
                Papion System unifies sales, inventory, customers, suppliers,
                expenses, wallets, roles, and realtime insight for a real
                event/decor business.
              </p>
              <div className="mt-8 grid max-w-[38rem] grid-cols-3 gap-3">
                {["Realtime", "Role-aware", "Web / PWA / Desktop"].map(
                  (item) => (
                    <div
                      key={item}
                      className="border-t border-[var(--color-drh-ink)]/14 pt-3"
                    >
                      <p
                        className="text-[0.74rem] font-semibold tracking-[0.18em] text-[var(--color-drh-ink)]/54 uppercase"
                        style={{ fontFamily: DISPLAY_FONT }}
                      >
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-8 rounded-[3rem] bg-[var(--color-drh-ink)]/8 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_34px_86px_rgb(10_10_10/0.18)]">
                <video
                  className="aspect-video w-full object-cover"
                  src={PAPION_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.1),transparent_24%,rgb(0_0_0/0.22)_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2
              className="mt-5 text-[clamp(3rem,7vw,6.5rem)] leading-[0.84] font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Fragmented work was the enemy.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Orders live in one place, money in another, inventory somewhere else.",
              "Managers need insight, employees need speed, finance needs traceability.",
              "Generic CRUD screens cannot model event/decor production complexity.",
              "Sensitive operations need permissions, confidence, and low-friction control.",
            ].map((item) => (
              <p
                key={item}
                className="border-t border-[var(--color-drh-ink)]/12 pt-4 text-[1.05rem] leading-[1.6] text-[var(--color-drh-ink)]/62"
                style={{ fontFamily: BODY_FONT }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] py-16">
        <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-10">
          <Eyebrow>Concept bridge</Eyebrow>
          <p
            className="mt-4 max-w-[38rem] text-[1.1rem] leading-[1.55] text-[var(--color-drh-ink)]/58"
            style={{ fontFamily: BODY_FONT }}
          >
            This section reuses the existing one-system flow as the moment where
            scattered business domains resolve into one connected operating
            layer.
          </p>
        </div>
        <div className="mt-10">
          <OneSystemFlow />
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[96rem]">
          <div className="max-w-[44rem]">
            <Eyebrow>Module chapters</Eyebrow>
            <h2
              className="mt-5 text-[clamp(3.4rem,8vw,7rem)] leading-[0.82] font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Six domains, one operating rhythm.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map((module) => (
              <article
                key={module.name}
                className="min-h-[22rem] border border-[var(--color-drh-ink)]/10 bg-white p-5 shadow-[0_18px_45px_rgb(10_10_10/0.05)]"
              >
                <p
                  className="text-[0.68rem] font-semibold tracking-[0.22em] text-[var(--color-drh-accent-orange)] uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {module.signal}
                </p>
                <h3
                  className="mt-4 text-[2.65rem] leading-[0.84] font-semibold uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {module.name}
                </h3>
                <p
                  className="mt-5 text-[1rem] leading-[1.58] text-[var(--color-drh-ink)]/62"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {module.body}
                </p>
                <div className="mt-8 border-t border-[var(--color-drh-ink)]/10 pt-4">
                  <p
                    className="text-[0.68rem] tracking-[0.2em] text-[var(--color-drh-ink)]/34 uppercase"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    Capture needed
                  </p>
                  <p
                    className="mt-2 text-[0.92rem] leading-[1.45] text-[var(--color-drh-ink)]/54"
                    style={{ fontFamily: BODY_FONT }}
                  >
                    {module.capture}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[96rem] gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Eyebrow>Workflow compression</Eyebrow>
            <h2
              className="mt-5 text-[clamp(3rem,7vw,6.6rem)] leading-[0.84] font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Fewer steps. Less hesitation.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WORKFLOWS.map((workflow) => (
              <MediaPlaceholder key={workflow.title} label={workflow.duration}>
                <h3
                  className="text-[2rem] leading-[0.9] font-semibold uppercase"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {workflow.title}
                </h3>
                <p
                  className="mt-4 text-[0.98rem] leading-[1.5] text-white/62"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {workflow.body}
                </p>
              </MediaPlaceholder>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-drh-ink)] px-5 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p
              className="text-[0.7rem] font-semibold tracking-[0.28em] text-white/42 uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Capture queue
            </p>
            <h2
              className="mt-5 text-[clamp(3rem,7vw,6.8rem)] leading-[0.84] font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              What to record next.
            </h2>
          </div>
          <div className="space-y-3">
            {CAPTURE_QUEUE.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 border-t border-white/12 pt-4"
              >
                <span
                  className="text-[1.2rem] text-white/28"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className="text-[1.05rem] leading-[1.5] text-white/68"
                  style={{ fontFamily: BODY_FONT }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default PapionSystemPage
