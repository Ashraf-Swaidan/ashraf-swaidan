import type { RefObject } from "react"
import { motion, useReducedMotion } from "motion/react"

import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { useHoverPlayVideo } from "@/hooks/useHoverPlayVideo"
import { appPath } from "@/lib/appPaths"

import {
  AK_BODY_FONT,
  AK_DISPLAY_FONT,
  AK_FRICTION_PILLS,
  AK_LOGO,
  AK_VIDEO_HERO,
  AK_VIDEO_POSTER,
} from "./ak-data"
import {
  AkEyebrow,
  AkProse,
  AkStoryStep,
  AkStoryTitle,
  AkWordmark,
} from "./ak-ui"

const AK_RECOMMENDED_WORK_IDS = ["papion", "duwit"] as const
const AK_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  AK_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof AK_RECOMMENDED_WORK_IDS)[number]
  )
)

function AkRecommendedWorkCard({
  project,
  index,
}: {
  project: (typeof AK_RECOMMENDED_WORKS)[number]
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
              style={{ fontFamily: AK_DISPLAY_FONT }}
            >
              {project.title}
            </p>
            <span
              className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/72 uppercase backdrop-blur-md"
              style={{ fontFamily: AK_DISPLAY_FONT }}
            >
              Case study
            </span>
          </div>
        </div>
      </article>
    </a>
  )
}

export function AkHeroSection({
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
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgb(13 148 136 / 0.08) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgb(56 189 248 / 0.06) 0%, transparent 42%), linear-gradient(90deg, rgb(10 10 10 / 0.03) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.03) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
        }}
      />

      <div className="ak-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href={appPath("/")}
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: AK_DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={AK_LOGO}
            alt="Ak System"
            className="h-9 w-9 shrink-0 object-contain opacity-90"
          />
        </header>

        <div className="text-center">
          <AkStoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: AK_DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <AkWordmark className="normal-case align-middle tracking-[0.06em]" />
            <span className="ml-1.5 tracking-[0.2em] uppercase">System</span>
          </p>
          <AkStoryTitle as="h1">
            Offline-first desktop control for a local electronics store.
          </AkStoryTitle>
          <AkProse className="mx-auto mt-6 max-w-prose text-center">
            <AkWordmark className="font-[inherit] text-[var(--color-drh-ink)]/92" />{" "}
            replaces fragile spreadsheets and scattered notes with a{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/88">
              single calm workspace
            </strong>
            : inventory, sales, customers, and exports—running locally with an
            exportable database the business actually owns.
          </AkProse>
          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: AK_DISPLAY_FONT }}
            >
              {(
                [
                  {
                    label: "Desktop system",
                    className:
                      "border border-teal-200/90 bg-teal-50 text-teal-950 shadow-[0_6px_18px_rgb(13_148_136/0.12)]",
                  },
                  {
                    label: "Offline first",
                    className:
                      "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
                  },
                  {
                    label: "Exportable database",
                    className:
                      "border border-amber-200/85 bg-amber-50/95 text-amber-950 shadow-[0_6px_18px_rgb(245_158_11/0.12)]",
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
              style={{ fontFamily: AK_BODY_FONT }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500/40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
              </span>
              <span>
                Local data, local speed — sell without waiting on the cloud
                <span className="sr-only"> (local-first indicator)</span>
              </span>
            </p>
            <p
              className="mt-3 text-center text-[0.68rem] tracking-[0.14em] text-[var(--color-drh-ink)]/40"
              style={{ fontFamily: AK_DISPLAY_FONT }}
            >
              Bilingual-friendly UI · Built for the counter, not the boardroom
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-[rgb(13_148_136/0.09)] blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-neutral-100 shadow-[0_28px_64px_rgb(10_10_10/0.1)] sm:rounded-2xl">
            <HeroLoopVideo
              className="aspect-video w-full object-cover"
              src={AK_VIDEO_HERO}
              poster={AK_VIDEO_POSTER}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_40%,rgb(10_10_10/0.06)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function AkFrictionSection() {
  const reduceMotion = useReducedMotion() === true

  const fade = {
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: [0.22, 0.08, 0.19, 1] as const },
  }

  const pillStyles = [
    "bg-teal-100 text-teal-950 border-teal-200/85",
    "bg-sky-100 text-sky-950 border-sky-200/80",
    "bg-amber-50 text-amber-950 border-amber-200/80",
    "bg-slate-100 text-slate-900 border-slate-200/75",
    "bg-cyan-50 text-cyan-950 border-cyan-200/75",
  ] as const

  return (
    <section className="ak-story-block border-y border-teal-950/8 bg-[var(--color-drh-surface)]/75 px-5 py-20 backdrop-blur-sm sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <AkStoryStep n="02" label="Friction" />
        <AkEyebrow>The daily mess</AkEyebrow>
        <AkStoryTitle>
          Small retail should not depend on luck—or a strong Wi‑Fi day.
        </AkStoryTitle>
        <AkProse className="mx-auto mt-6 max-w-prose">
          Electronics shops live with returns, warranties, serial habits, and
          fast counter turns. When stock lives in ad‑hoc files and customer
          history lives who‑knows‑where, every busy hour becomes a trust
          problem. The owner asked for something that works{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/86">
            offline
          </strong>
          , with a database they can{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/86">
            hold and export
          </strong>
          .
        </AkProse>
      </div>

      <motion.div
        className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-2.5 sm:gap-3"
        initial={fade.initial}
        whileInView={fade.animate}
        viewport={{ once: true, margin: "-40px" }}
        transition={fade.transition}
      >
        {AK_FRICTION_PILLS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.08em] uppercase ${pillStyles[i % pillStyles.length]}`}
            style={{ fontFamily: AK_DISPLAY_FONT }}
          >
            {label}
          </span>
        ))}
      </motion.div>
    </section>
  )
}

export function AkOfflineLocalSection() {
  return (
    <section className="ak-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <AkStoryStep n="03" label="Local" />
        <AkEyebrow>Ownership</AkEyebrow>
        <AkStoryTitle>
          A deliberate local database—not “sync anxiety” dressed as a feature.
        </AkStoryTitle>
        <AkProse className="mx-auto mt-6 max-w-prose">
          The product keeps operational truth on disk: sales, stock movement,
          and customer context move together in one exportable store. Backup and
          hand-off stay explicit—so the business is never one outage away from
          not being able to ring someone up.
        </AkProse>
        <ul
          className="mx-auto mt-10 max-w-lg space-y-3 text-left text-[0.9rem] leading-relaxed text-[var(--color-drh-ink-muted)]"
          style={{ fontFamily: AK_BODY_FONT }}
        >
          <li className="border-l-2 border-teal-500/55 pl-4">
            <strong className="font-medium text-[var(--color-drh-ink)]/84">
              Portable exports
            </strong>{" "}
            for audit, accountant handoff, or moving machines without drama.
          </li>
          <li className="border-l-2 border-amber-500/45 pl-4">
            <strong className="font-medium text-[var(--color-drh-ink)]/84">
              Counter-first latency
            </strong>{" "}
            — keyboard and scanning flows stay snappy with no round trip.
          </li>
        </ul>
      </div>
    </section>
  )
}

export function AkFitSection() {
  return (
    <section className="ak-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <AkStoryStep n="04" label="Fit" />
        <AkEyebrow>Why desktop</AkEyebrow>
        <AkStoryTitle>
          Density, discipline, and a machine that still feels like theirs.
        </AkStoryTitle>
        <AkProse className="mx-auto mt-6 max-w-prose">
          This business did not need another SaaS dashboard—it needed a reliable
          tool that respects how staff actually work: big lists, quick search,
          minimal animation, Arabic and English in the same room, and no lecture
          about multi-tenant strategy. The goal was a{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/86">
            boring-in-a-good-way
          </strong>{" "}
          system that survives Tuesday at 6pm.
        </AkProse>
      </div>
    </section>
  )
}

export function AkFooter() {
  return (
    <footer className="ak-story-block py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: AK_DISPLAY_FONT }}
          >
            More work
          </p>
          <a
            href={appPath("/")}
            className="inline-flex w-fit rounded-full border border-teal-900/18 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-teal-600/50 hover:bg-teal-50/90"
            style={{ fontFamily: AK_DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {AK_RECOMMENDED_WORKS.map((project, index) => (
            <AkRecommendedWorkCard
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
