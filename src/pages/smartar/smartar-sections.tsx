import { type RefObject } from "react"
import { motion, useReducedMotion } from "motion/react"

import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { useHoverPlayVideo } from "@/hooks/useHoverPlayVideo"

import {
  SMARTAR_AI_VIDEO,
  SMARTAR_BODY_FONT,
  SMARTAR_DISPLAY_FONT,
  SMARTAR_ENTRY_PASSWORD,
  SMARTAR_HERO_PILLS,
  SMARTAR_LOGO,
  SMARTAR_STORE_URL,
  SMARTAR_VIDEO_HERO,
  SMARTAR_VIDEO_POSTER,
} from "./smartar-data"
import {
  SmartarProse,
  SmartarStoryStep,
  SmartarStoryTitle,
  SmartarWordmark,
} from "./smartar-ui"

const SMARTAR_RECOMMENDED_WORK_IDS = ["duwit", "luxian"] as const
const SMARTAR_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  SMARTAR_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof SMARTAR_RECOMMENDED_WORK_IDS)[number]
  )
)

function SmartarRecommendedWorkCard({
  project,
  index,
}: {
  project: (typeof SMARTAR_RECOMMENDED_WORKS)[number]
  index: number
}) {
  const { videoRef, onPointerEnter, onPointerLeave } = useHoverPlayVideo()

  return (
    <a
      href={project.href}
      className={`group block overflow-hidden rounded-[1.65rem] border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] shadow-[0_28px_70px_rgb(10_10_10/0.1)] sm:rounded-[2rem] ${
        index === 0 ? "lg:justify-self-end" : "lg:justify-self-start"
      }`}
    >
      <article className="text-left">
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
              style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
            >
              {project.title}
            </p>
            <span
              className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/72 uppercase backdrop-blur-md"
              style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
            >
              Case study
            </span>
          </div>
        </div>
      </article>
    </a>
  )
}

function SmartarEntryPassPill() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-none border border-[var(--color-drh-accent-orange)]/45 bg-[rgb(255_122_0/0.14)] px-2.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.1em] text-orange-950 uppercase shadow-[0_0_14px_rgb(255_122_0/0.34),0_0_28px_rgb(255_122_0/0.12),0_5px_14px_rgb(255_122_0/0.16)] sm:gap-2 sm:px-3 sm:py-2 sm:text-[0.68rem]"
      style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
    >
      Entry Pass
      <code className="rounded-sm bg-white/55 px-1 py-0.5 text-[0.68rem] font-bold tracking-[0.04em] text-[var(--color-drh-accent-orange)] normal-case sm:text-[0.72rem]">
        {SMARTAR_ENTRY_PASSWORD}
      </code>
    </span>
  )
}

export function SmartarHeroSection({
  heroNavRef,
}: {
  heroNavRef?: RefObject<HTMLElement | null>
}) {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-10 pb-14 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgb(16 185 129 / 0.08) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgb(255 122 0 / 0.05) 0%, transparent 42%), linear-gradient(90deg, rgb(10 10 10 / 0.03) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.03) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
        }}
      />

      <div className="smartar-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href="/"
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={SMARTAR_LOGO}
            alt="SMARTAR"
            className="h-9 w-9 shrink-0 object-contain opacity-90"
          />
        </header>

        <div className="text-center">
          <SmartarStoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <SmartarWordmark className="normal-case align-middle tracking-[0.06em]" />
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <span className="tracking-[0.18em] uppercase text-[var(--color-drh-accent-orange)]">
              In progress
            </span>
          </p>
          <SmartarStoryTitle as="h1">
            Shopify commerce with the AI in the theme, not beside it.
          </SmartarStoryTitle>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3">
            <SmartarEntryPassPill />
            <a
              href={SMARTAR_STORE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)] bg-[var(--color-drh-accent-orange)] px-6 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:border-[var(--color-drh-ink)] hover:bg-[var(--color-drh-ink)]"
              style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
            >
              Visit store
            </a>
          </div>

          <SmartarProse className="mx-auto mt-6 max-w-prose text-center">
            I built <SmartarWordmark className="font-[inherit] text-[var(--color-drh-ink)]/95" />{" "}
            to show how far our own{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/88">
              custom Liquid theme
            </strong>{" "}
            can go on Shopify—not a known theme reskin: merchandising blocks, collection tooling, and a{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/88">
              catalog-aware assistant
            </strong>{" "}
            that renders real product cards in the conversation. Checkout stays
            on Shopify; the craft is the storefront and the AI woven into it.
          </SmartarProse>

          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
            >
              {SMARTAR_HERO_PILLS.map(({ label, className }) => (
                <span
                  key={label}
                  className={`rounded-none px-3 py-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase shadow-[0_6px_16px_rgb(10_10_10/0.08)] ${className}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <p
              className="mt-5 flex items-center justify-center gap-2 text-center text-[0.78rem] text-[var(--color-drh-ink)]/48"
              style={{ fontFamily: SMARTAR_BODY_FONT }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>
                AI shopping assistant is live in beta on the storefront
              </span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-[rgb(16_185_129/0.08)] blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-neutral-100 shadow-[0_28px_64px_rgb(10_10_10/0.1)] sm:rounded-2xl">
            <HeroLoopVideo
              className="aspect-video w-full object-cover"
              src={SMARTAR_VIDEO_HERO}
              poster={SMARTAR_VIDEO_POSTER}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_40%,rgb(10_10_10/0.06)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function SmartarAiSection() {
  const reduceMotion = useReducedMotion() === true

  return (
    <section className="smartar-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <SmartarStoryStep n="02" label="AI experience" />
        <p
          className="text-[0.68rem] font-medium tracking-[0.22em] text-[var(--color-drh-ink)]/40 uppercase"
          style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
        >
          Beta · built into the theme
        </p>
        <SmartarStoryTitle as="h2">
          Ask the store; get cards, not paragraphs.
        </SmartarStoryTitle>
        <SmartarProse className="mx-auto mt-6 max-w-prose text-center">
          The assistant reads catalog JSON on load and answers with widgets the
          theme renders—product cards with{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            Add to cart
          </strong>
          , collection banners, and compare layouts from real handles. Open{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            Ask AI
          </strong>{" "}
          from the header or the floating pill.
        </SmartarProse>
        <p
          className="mx-auto mt-6 max-w-prose rounded-none border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] px-4 py-3 text-left text-[0.88rem] leading-relaxed text-[var(--color-drh-ink)]/62"
          style={{ fontFamily: SMARTAR_BODY_FONT }}
        >
          <strong className="font-medium text-[var(--color-drh-ink)]/82">
            AI shopping assistant (beta)
          </strong>
          — Built into the theme, not a bolt-on app. API calls run from the
          browser for this demo; production would move keys and inference behind
          a server proxy.
        </p>
      </div>

      <motion.div
        className="relative mx-auto mt-12 max-w-4xl"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.85, ease: [0.22, 0.08, 0.19, 1] }}
      >
        <div
          className="absolute -inset-3 rounded-[2rem] bg-[rgb(255_122_0/0.07)] blur-2xl"
          aria-hidden
        />
        <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-neutral-100 shadow-[0_28px_64px_rgb(10_10_10/0.1)] sm:rounded-2xl">
          <HeroLoopVideo
            className="aspect-video w-full object-cover"
            src={SMARTAR_AI_VIDEO}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.08),transparent_40%,rgb(10_10_10/0.05)_100%)]" />
        </div>
        <p
          className="mt-4 text-center text-[0.82rem] leading-relaxed text-[var(--color-drh-ink)]/48"
          style={{ fontFamily: SMARTAR_BODY_FONT }}
        >
          Screen recording: budget ask, compare flow, and in-chat widgets on the
          live storefront.
        </p>
      </motion.div>

      <div className="mx-auto mt-14 max-w-2xl text-center">
        <SmartarStoryStep n="03" label="Outcome" />
        <SmartarProse className="text-[1.05rem] sm:text-[1.12rem]">
          <SmartarWordmark className="font-[inherit] text-[var(--color-drh-ink)]/95" />{" "}
          is the counterpoint to my{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            Luxian
          </strong>{" "}
          build: there I own the full stack; here I stayed on Shopify and
          invested in theme craft plus integrated AI—a live URL you can walk,
          not a mockup.
        </SmartarProse>
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <SmartarEntryPassPill />
          <a
            href={SMARTAR_STORE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)] bg-[var(--color-drh-accent-orange)] px-6 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase transition hover:border-[var(--color-drh-ink)] hover:bg-[var(--color-drh-ink)]"
            style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
          >
            Visit store
          </a>
        </div>
      </div>
    </section>
  )
}

export function SmartarComingSoonSection() {
  return (
    <section className="smartar-story-block border-t border-[var(--color-drh-ink)]/08 px-5 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2
          className="text-balance text-[clamp(2.2rem,8vw,4.5rem)] leading-[0.92] font-semibold tracking-[-0.02em] text-[var(--color-drh-ink)] uppercase sm:text-[clamp(2.8rem,7vw,5rem)]"
          style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
        >
          Full Detailed Usecase Coming Soon
        </h2>
        <p
          className="mx-auto mt-8 max-w-2xl text-[1.08rem] leading-[1.72] text-[var(--color-drh-ink-muted)] sm:mt-10 sm:text-[1.2rem]"
          style={{
            fontFamily: SMARTAR_BODY_FONT,
            fontVariationSettings: '"opsz" 64, "wght" 410',
          }}
        >
          Look forward to it, it&apos;ll be a blast of state-of-the-art
          e-commerce features!!
        </p>
      </div>
    </section>
  )
}

export function SmartarFooter() {
  return (
    <footer className="smartar-story-block py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
          >
            More work
          </p>
          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-[var(--color-drh-ink)]/14 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[rgb(255_122_0/0.08)]"
            style={{ fontFamily: SMARTAR_DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {SMARTAR_RECOMMENDED_WORKS.map((project, index) => (
            <SmartarRecommendedWorkCard
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
