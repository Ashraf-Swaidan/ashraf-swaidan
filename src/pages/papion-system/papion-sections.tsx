import type { RefObject } from "react"
import { OneSystemFlow } from "@/components/landing/one-system-flow/OneSystemFlow"
import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { useHoverPlayVideo } from "@/hooks/useHoverPlayVideo"

import { BranchInventoryMap } from "./BranchInventoryMap"
import {
  BODY_FONT,
  CASE_ASSETS,
  DISPLAY_FONT,
  PAPION_LOGO,
  PAPION_MODULE_EXPLORER_ID,
  PAPION_VIDEO_HERO,
} from "./papion-data"
import {
  CaseStudyFigure,
  FinanceVideoStrip,
  OrderSpineVideo,
  ResponsiveTriptych,
} from "./papion-media"
import { Eyebrow, PapionWordmark, Prose, StoryStep, StoryTitle } from "./papion-ui"

const PAPION_RECOMMENDED_WORK_IDS = ["duwit", "ak-system"] as const
const PAPION_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  PAPION_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof PAPION_RECOMMENDED_WORK_IDS)[number]
  )
)

function PapionRecommendedWorkCard({
  project,
  index,
}: {
  project: (typeof PAPION_RECOMMENDED_WORKS)[number]
  index: number
}) {
  const { videoRef, onPointerEnter, onPointerLeave } = useHoverPlayVideo()

  return (
    <article
      className={`group overflow-hidden rounded-[1.65rem] border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] shadow-[0_28px_70px_rgb(10_10_10/0.1)] sm:rounded-[2rem] ${
        index === 0 ? "lg:justify-self-end" : "lg:justify-self-start"
      }`}
    >
      <div
        className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--color-drh-ink)] lg:w-[min(40vw,34rem)]"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <img
          src={project.imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.035]"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          src={project.videoSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.02),rgb(10_10_10/0.58))]"
          aria-hidden
        />
        <img
          src={project.logoSrc}
          alt=""
          className="absolute top-6 left-6 h-13 w-13 object-contain drop-shadow-[0_8px_18px_rgb(0_0_0/0.22)] sm:h-14 sm:w-14"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p
            className="text-[clamp(2.45rem,6.2vw,4.45rem)] leading-[0.84] font-semibold text-white uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {project.title}
          </p>
          <a
            href={project.href}
            className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/78 uppercase backdrop-blur-md transition hover:border-white/45 hover:bg-white/20 hover:text-white"
            style={{ fontFamily: DISPLAY_FONT }}
            aria-label={`Open ${project.title} case study`}
          >
            Case study
          </a>
        </div>
      </div>
    </article>
  )
}

export function PapionHeroSection({
  heroNavRef,
}: {
  heroNavRef?: RefObject<HTMLElement | null>
}) {
  const explorePapion = () => {
    const el = document.getElementById(PAPION_MODULE_EXPLORER_ID)
    if (!el) return
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <section className="relative isolate overflow-hidden px-5 pt-10 pb-14 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(10 10 10 / 0.45) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.32) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="papion-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href="/"
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={PAPION_LOGO}
            alt="Papion"
            className="h-9 w-9 shrink-0 object-contain opacity-85"
          />
        </header>

        <div className="text-center">
          <StoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <PapionWordmark className="normal-case align-middle tracking-[0.06em]" />
            <span className="ml-1.5 tracking-[0.2em] uppercase">System</span>
          </p>
          <StoryTitle as="h1">
            One calm operating system for a multibranch decor business.
          </StoryTitle>
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={explorePapion}
              className="cursor-pointer rounded-3xl border border-white/12 bg-black px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-white/92 uppercase transition hover:bg-neutral-950 hover:text-white [corner-shape:squircle]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Explore Papion
            </button>
          </div>
          <Prose className="mx-auto mt-6 max-w-prose text-center">
            <PapionWordmark className="font-[inherit] text-[var(--color-drh-ink)]/90" />{" "}
            ties together event decoration, a print-and-cut workshop, and balloon
            retail in{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/80">
              one role-aware app
            </strong>
            : eight inventories, mixed orders, wallets, suppliers, expenses, and
            live insight.
          </Prose>
          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {(
                [
                  { label: "Desktop App", className: "bg-sky-300 text-sky-950" },
                  {
                    label: "On the Web",
                    className: "bg-violet-300 text-violet-950",
                  },
                  {
                    label: "On the phone (PWA)",
                    className: "bg-emerald-300 text-emerald-950",
                  },
                ] as const
              ).map(({ label, className }) => (
                <span
                  key={label}
                  className={`rounded-none px-3 py-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase shadow-[0_6px_16px_rgb(10_10_10/0.08)] ${className}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <p
              className="mt-5 flex items-center justify-center gap-2 text-center text-[0.78rem] text-[var(--color-drh-ink)]/45"
              style={{ fontFamily: BODY_FONT }}
            >
              <span
                className="relative flex h-2 w-2 shrink-0"
                aria-hidden
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              <span>
                Realtime operational data
                <span className="sr-only"> (live indicator)</span>
              </span>
            </p>
            <p
              className="mt-3 text-center text-[0.68rem] tracking-[0.14em] text-[var(--color-drh-ink)]/34"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              React · Vite · Tailwind · Firebase · AI API · Electron
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-[var(--color-drh-ink)]/6 blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-black shadow-[0_28px_64px_rgb(10_10_10/0.12)] sm:rounded-2xl">
            <HeroLoopVideo
              className="aspect-video w-full object-cover"
              src={PAPION_VIDEO_HERO}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_30%,rgb(0_0_0/0.2)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function BusinessMapSection() {
  return (
    <section className="papion-story-block border-[var(--color-drh-ink)]/08 border-y bg-[var(--color-drh-surface)]/80 px-5 py-20 backdrop-blur-sm sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <StoryStep n="03" label="Map" />
        <Eyebrow>The business map</Eyebrow>
        <StoryTitle>Eight inventories, three branches.</StoryTitle>
        <Prose className="mx-auto mt-6 max-w-prose">
          The workshop handles wide-format and laser work; balloon retail covers
          latex, helium, and basics; event decoration owns chocolate and stands.
          Papion System keeps that map explicit so orders never pretend
          everything came from the same generic shelf.
        </Prose>
      </div>
      <div className="mt-12">
        <BranchInventoryMap />
      </div>
    </section>
  )
}

export function OrderSpineSection() {
  return (
    <section className="papion-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <StoryStep n="04" label="Flow" />
          <Eyebrow>The order spine</Eyebrow>
          <StoryTitle>
            From customer insight to mixed cart, money, and the calendar.
          </StoryTitle>
          <Prose className="mx-auto mt-6 max-w-prose text-center">
            Retail and wholesale profiles carry context before anyone sells. One
            order can mix inventories. Wallets record payment and partial pay.
            Unpaid work stays visible. The sales calendar respects due dates and
            real events. Tasks — including in sales — keep messy weeks on the
            rails.
          </Prose>
        </div>
        <div className="relative mx-auto mt-12 max-w-3xl">
          <OrderSpineVideo />
          <p
            className="mt-4 text-center text-[0.78rem] leading-[1.5] text-[var(--color-drh-ink)]/42"
            style={{ fontFamily: BODY_FONT }}
          >
            Dedicated clip:{" "}
            <code className="rounded bg-[var(--color-drh-ink)]/6 px-1 text-[0.72rem]">
              papion-workflow-order.mp4
            </code>{" "}
            in{" "}
            <code className="rounded bg-[var(--color-drh-ink)]/6 px-1 text-[0.72rem]">
              public/assets/lap-animation-assets/
            </code>
            . Falls back to the hero loop until then.
          </p>
        </div>
      </div>
    </section>
  )
}

export function ConnectedLayerSection() {
  return (
    <section className="papion-story-block bg-[var(--color-drh-surface)]/60 pt-16 pb-0 sm:pt-20">
      <div className="mx-auto max-w-prose px-5 text-center sm:px-6 lg:px-8">
        <StoryStep n="05" label="Connection" />
        <Eyebrow>One connected layer</Eyebrow>
        <StoryTitle>When domains stop being islands.</StoryTitle>
        <Prose className="mx-auto mt-6 max-w-prose text-center">
          Sales, inventory, wallets, and insight share one spine. Scroll the
          diagram — it is the same handoff teams feel when talk on the shelf
          turns into movement in the ledger.
        </Prose>
      </div>
      <div className="mt-12">
        <OneSystemFlow />
      </div>
    </section>
  )
}

export function FinanceSection() {
  return (
    <section className="papion-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-prose text-center">
          <StoryStep n="06" label="Finance" />
          <Eyebrow>Finance &amp; control</Eyebrow>
          <StoryTitle>
            Cash, COGS, and the unpaid truth in one place.
          </StoryTitle>
          <Prose className="mx-auto mt-6 max-w-prose text-center">
            Wallets catch what orders promise. Loans move liquidity. Supplier
            orders explain how stock got there; everyday expenses explain what
            else left the business. Margins become a conversation you can have
            every week.
          </Prose>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-start">
          <ul className="space-y-4 text-[0.95rem] leading-[1.65] text-[var(--color-drh-ink)]/62">
            {[
              "Unpaid sales as a first-class view — not a buried export.",
              "Purchases tied to inventory and the wallet that actually paid.",
              "Expenses with branch and personal context next to revenue.",
            ].map((line) => (
              <li
                key={line}
                className="border-[var(--color-drh-ink)]/08 flex gap-3 border-t pt-4 first:border-t-0 first:pt-0"
                style={{ fontFamily: BODY_FONT }}
              >
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-drh-accent-orange)]/60"
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>
          <FinanceVideoStrip />
        </div>
      </div>
    </section>
  )
}

export function GovernanceSection() {
  return (
    <section className="papion-story-block border-white/6 bg-[var(--color-drh-ink)] px-5 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <StoryStep n="07" label="Governance" />
        <p
          className="text-[0.68rem] font-medium tracking-[0.2em] text-white/38 uppercase"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Governance
        </p>
        <h2
          className="mt-4 text-[1.45rem] leading-snug font-medium tracking-[-0.02em] text-balance text-white sm:text-[1.65rem] md:text-[1.85rem]"
          style={{
            fontFamily: BODY_FONT,
            fontVariationSettings: '"opsz" 72, "wght" 520',
          }}
        >
          Roles, settings, and the small permissions that change everything.
        </h2>
        <Prose className="mx-auto mt-6 max-w-prose text-center text-white/65">
          Admins build role combinations that mirror real life — including
          hiding sensitive cost numbers while keeping daily tools fast. Settings
          follow people across routes. Authentication here is not theater; it is
          how Papion actually runs.
        </Prose>
        <p
          className="mt-8 text-[0.82rem] leading-relaxed text-white/38"
          style={{ fontFamily: BODY_FONT }}
        >
          Screenshot home:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.78rem]">
            papion-module-roles.png
          </code>
        </p>
      </div>
    </section>
  )
}

export function InterfaceCraftSection() {
  return (
    <section className="papion-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <StoryStep n="08" label="Surfaces" />
        <Eyebrow>Interface craft</Eyebrow>
        <StoryTitle>Three devices, three intentional layouts.</StoryTitle>
        <Prose className="mx-auto mt-6 max-w-prose text-center">
          Responsiveness here is not squish — it is re-layout. Density,
          navigation, and controls shift between desktop Electron, browser, and
          installable PWA so warehouse, desk, and phone each feel like they were
          designed on purpose.
        </Prose>
      </div>
      <div className="mt-12">
        <ResponsiveTriptych />
      </div>
    </section>
  )
}

export function AiSection() {
  return (
    <section className="papion-story-block border-[var(--color-drh-ink)]/08 border-t bg-[var(--color-drh-surface)]/70 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="text-center lg:text-left">
          <StoryStep n="09" label="Beta" />
          <Eyebrow>Papion AI</Eyebrow>
          <StoryTitle>Models on your business, with guardrails.</StoryTitle>
          <Prose className="mx-auto mt-6 max-w-prose text-center lg:mx-0 lg:text-left">
            The newest route is beta for a reason: strong models, careful access
            to operational data, and the same permission story as the rest of
            the stack — not a bolt-on chat in an iframe.
          </Prose>
        </div>
        <CaseStudyFigure
          src={CASE_ASSETS.ai}
          alt="Papion AI conversation interface (planned)"
          plannedLabel="Planned: papion-module-ai.png — conversation UI with anonymized demo data."
          caption="Swap in a screenshot when the beta UI is ready for the public page."
        />
      </div>
    </section>
  )
}

export function PapionFooter() {
  return (
    <footer className="papion-story-block bg-[var(--color-drh-bg)] py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/36 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Check other projects
          </p>
          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-[var(--color-drh-ink)]/30 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[var(--color-drh-accent-orange)] hover:text-white"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {PAPION_RECOMMENDED_WORKS.map((project, index) => (
            <PapionRecommendedWorkCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
