import type { RefObject } from "react"
import { motion, useReducedMotion } from "motion/react"

import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { useHoverPlayVideo } from "@/hooks/useHoverPlayVideo"
import { appPath } from "@/lib/appPaths"

import {
  LUXIAN_BODY_FONT,
  LUXIAN_DISPLAY_FONT,
  LUXIAN_LOGO,
  LUXIAN_REPO_URL,
  LUXIAN_TRY_URL,
  LUXIAN_VIDEO_HERO,
  LUXIAN_VIDEO_POSTER,
} from "./luxian-data"
import { LuxianWhyBuildGrid } from "./LuxianWhyBuildGrid"
import {
  LuxianProse,
  LuxianStoryStep,
  LuxianStoryTitle,
  LuxianWordmark,
} from "./luxian-ui"

const LUXIAN_RECOMMENDED_WORK_IDS = ["papion", "duwit"] as const
const LUXIAN_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  LUXIAN_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof LUXIAN_RECOMMENDED_WORK_IDS)[number]
  )
)

function LuxianRecommendedWorkCard({
  project,
  index,
}: {
  project: (typeof LUXIAN_RECOMMENDED_WORKS)[number]
  index: number
}) {
  const { videoRef, onPointerEnter, onPointerLeave } = useHoverPlayVideo()

  return (
    <a
      href={appPath(project.href)}
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
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(15_31_20/0.02),rgb(15_31_20/0.58))]"
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
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              {project.title}
            </p>
            <span
              className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/72 uppercase backdrop-blur-md"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              Case study
            </span>
          </div>
        </div>
      </article>
    </a>
  )
}

export function LuxianHeroSection({
  heroNavRef,
}: {
  heroNavRef?: RefObject<HTMLElement | null>
}) {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-10 pb-14 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgb(255 122 0 / 0.09) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgb(251 146 60 / 0.06) 0%, transparent 42%), linear-gradient(90deg, rgb(10 10 10 / 0.03) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.03) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
        }}
      />

      <div className="luxian-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href={appPath("/")}
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={LUXIAN_LOGO}
            alt="Luxian"
            className="h-9 w-9 shrink-0 object-contain opacity-90"
          />
        </header>

        <div className="text-center">
          <LuxianStoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <LuxianWordmark className="normal-case align-middle tracking-[0.06em]" />
          </p>
          <LuxianStoryTitle as="h1">
            Fashion commerce you own end to end, not another storefront
            template.
          </LuxianStoryTitle>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={LUXIAN_TRY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)]/35 bg-[rgb(255_122_0/0.1)] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)]/55 hover:bg-[rgb(255_122_0/0.16)]"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              Try Luxian live
            </a>
            <a
              href={LUXIAN_REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-ink)]/12 bg-white px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-[var(--color-drh-ink)]/88 uppercase shadow-[0_4px_20px_rgb(10_10_10/0.04)] transition hover:border-[var(--color-drh-ink)]/18"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              View repo
            </a>
          </div>
          <LuxianProse className="mx-auto mt-6 max-w-prose text-center">
            <LuxianWordmark className="font-[inherit] text-[var(--color-drh-ink)]/95" /> is a
            NestJS + PostgreSQL API and Next.js storefront for a boutique apparel
            line: editorial discovery for shoppers, inventory discipline and
            permission-scoped admin for the team running the brand.
          </LuxianProse>
          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
            >
              {(
                [
                  {
                    label: "Editorial homepage",
                    className:
                      "border border-orange-200/90 bg-orange-50 text-orange-950 shadow-[0_6px_18px_rgb(255_122_0/0.12)]",
                  },
                  {
                    label: "Real stock rules",
                    className:
                      "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
                  },
                  {
                    label: "Operator back office",
                    className:
                      "border border-amber-200/80 bg-amber-50/90 text-amber-950 shadow-[0_6px_18px_rgb(251_191_36/0.12)]",
                  },
                ] as const
              ).map(({ label, className }) => (
                <span
                  key={label}
                  className={`rounded-none px-3 py-2 text-[0.68rem] font-semibold tracking-[0.12em] uppercase ${className}`}
                >
                  {label}
                </span>
              ))}
            </div>
            <p
              className="mt-5 flex items-center justify-center gap-2 text-center text-[0.78rem] text-[var(--color-drh-ink)]/48"
              style={{ fontFamily: LUXIAN_BODY_FONT }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-drh-accent-orange)]/45 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-drh-accent-orange)]" />
              </span>
              <span>
                Monorepo: API on Nest, storefront on Next
                <span className="sr-only"> (stack indicator)</span>
              </span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-[rgb(255_122_0/0.08)] blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-neutral-100 shadow-[0_28px_64px_rgb(10_10_10/0.1)] sm:rounded-2xl">
            <HeroLoopVideo
              className="aspect-video w-full object-cover"
              src={LUXIAN_VIDEO_HERO}
              poster={LUXIAN_VIDEO_POSTER}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_40%,rgb(15_31_20/0.06)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function LuxianSystemSection() {
  const reduceMotion = useReducedMotion() === true

  return (
    <section className="luxian-story-block border-y border-[var(--color-drh-ink)]/08 bg-[var(--color-drh-surface)]/90 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
        <LuxianStoryStep n="02" label="System" />
        <p
          className="text-[0.68rem] font-medium tracking-[0.22em] text-[var(--color-drh-ink)]/40 uppercase"
          style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
        >
          Why build it
        </p>
        <LuxianStoryTitle as="h2">
          I did not want Shopify limits or a custom store that only edits product
          rows.
        </LuxianStoryTitle>
      </div>

      <LuxianWhyBuildGrid />

      <motion.div
        className="mx-auto mt-14 max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.22, 0.08, 0.19, 1] }}
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={LUXIAN_TRY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)]/35 bg-[rgb(255_122_0/0.1)] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)]/55 hover:bg-[rgb(255_122_0/0.16)]"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            Try Luxian live
          </a>
          <a
            href={LUXIAN_REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-black/80 bg-black px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-white/92 uppercase transition hover:bg-neutral-950"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            View repo
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export function LuxianFooter() {
  return (
    <footer className="luxian-story-block py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            More work
          </p>
          <a
            href={appPath("/")}
            className="inline-flex w-fit rounded-full border border-[var(--color-drh-ink)]/14 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[rgb(255_122_0/0.08)]"
            style={{ fontFamily: LUXIAN_DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {LUXIAN_RECOMMENDED_WORKS.map((project, index) => (
            <LuxianRecommendedWorkCard
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
