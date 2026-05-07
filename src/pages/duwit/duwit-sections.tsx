import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react"
import { motion, useReducedMotion } from "motion/react"

import { HeroLoopVideo } from "@/components/media/HeroLoopVideo"
import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"
import { useHoverPlayVideo } from "@/hooks/useHoverPlayVideo"

import {
  DUWIT_BODY_FONT,
  DUWIT_DESKTOP_APP_URL,
  DUWIT_DISPLAY_FONT,
  DUWIT_FRICTION_ASSETS,
  DUWIT_FRICTION_VIBE_PILLS,
  DUWIT_LOGO,
  DUWIT_TRY_URL,
  DUWIT_VIDEO_HERO,
  DUWIT_VIDEO_POSTER,
} from "./duwit-data"
import {
  DuwitProse,
  DuwitStoryStep,
  DuwitStoryTitle,
  DuwitWordmark,
} from "./duwit-ui"

function FrictionMemePhrase() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDocPointer)
    return () => document.removeEventListener("pointerdown", onDocPointer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <span ref={wrapRef} className="relative inline align-baseline">
      <button
        type="button"
        className="cursor-pointer rounded-sm border-0 bg-amber-100/95 px-0.5 underline decoration-2 decoration-[var(--color-drh-accent-orange)]/80 underline-offset-[3px] transition hover:bg-amber-200/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-accent-orange)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-surface)]"
        style={{ fontFamily: DUWIT_BODY_FONT }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label='Reveal "Why so serious?" meme'
        onClick={() => setOpen((v) => !v)}
      >
        oh absolutely, you can do it,
      </button>
      {open ? (
        <span
          className="absolute left-1/2 top-full z-[80] mt-2 w-[min(16.5rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-[var(--color-drh-ink)]/12 bg-white p-2 shadow-[0_22px_55px_rgb(0_0_0/0.18)] sm:left-0 sm:translate-x-0"
          role="dialog"
        >
          <img
            src={DUWIT_FRICTION_ASSETS.memePop}
            alt="Joker: Why so serious?"
            className="block max-h-[220px] w-full rounded-lg object-contain"
            width={280}
            height={180}
            loading="lazy"
            decoding="async"
          />
        </span>
      ) : null}
    </span>
  )
}

const DUWIT_RECOMMENDED_WORK_IDS = ["papion", "ak-system"] as const
const DUWIT_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  DUWIT_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof DUWIT_RECOMMENDED_WORK_IDS)[number]
  )
)

function DuwitRecommendedWorkCard({
  project,
  index,
}: {
  project: (typeof DUWIT_RECOMMENDED_WORKS)[number]
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
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              {project.title}
            </p>
            <span
              className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/72 uppercase backdrop-blur-md"
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              Case study
            </span>
          </div>
        </div>
      </article>
    </a>
  )
}

export function DuwitHeroSection({
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
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgb(255 122 0 / 0.09) 0%, transparent 55%), radial-gradient(circle at 85% 30%, rgb(251 146 60 / 0.06) 0%, transparent 42%), linear-gradient(90deg, rgb(10 10 10 / 0.03) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.03) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
        }}
      />

      <div className="duwit-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href="/"
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={DUWIT_LOGO}
            alt="Duwit"
            className="h-9 w-9 shrink-0 object-contain opacity-90"
          />
        </header>

        <div className="text-center">
          <DuwitStoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <DuwitWordmark className="normal-case align-middle tracking-[0.06em]" />
          </p>
          <DuwitStoryTitle as="h1">
            AI-native execution: from vague intent to finished outcomes.
          </DuwitStoryTitle>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={DUWIT_TRY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)]/35 bg-[rgb(255_122_0/0.1)] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)]/55 hover:bg-[rgb(255_122_0/0.16)]"
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              Try Duwit live
            </a>
            <a
              href={DUWIT_DESKTOP_APP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-ink)]/12 bg-[var(--color-drh-surface)] px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-[var(--color-drh-ink)]/88 uppercase shadow-[0_4px_20px_rgb(10_10_10/0.04)] transition hover:border-[var(--color-drh-ink)]/18"
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              Try Desktop App
            </a>
          </div>
          <DuwitProse className="mx-auto mt-6 max-w-prose text-center">
            <DuwitWordmark className="font-[inherit] text-[var(--color-drh-ink)]/95" />{" "}
            is built for people who want to{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/88">
              finish meaningful goals
            </strong>
            —not collect motivational chat logs. Planning, teaching, memory,
            and execution UX share one continuous loop.
          </DuwitProse>
          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              {(
                [
                  {
                    label: "Goal → roadmap",
                    className:
                      "border border-orange-200/90 bg-orange-50 text-orange-950 shadow-[0_6px_18px_rgb(255_122_0/0.12)]",
                  },
                  {
                    label: "Task-scoped AI",
                    className:
                      "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
                  },
                  {
                    label: "Durable memory",
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
              style={{ fontFamily: DUWIT_BODY_FONT }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-drh-accent-orange)]/45 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-drh-accent-orange)]" />
              </span>
              <span>
                Coaching loop stays on one task at a time
                <span className="sr-only"> (active loop indicator)</span>
              </span>
            </p>
            <p
              className="mt-3 text-center text-[0.68rem] tracking-[0.14em] text-[var(--color-drh-ink)]/40"
              style={{ fontFamily: DUWIT_DISPLAY_FONT }}
            >
              Web app and Windows desktop — same core
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
              src={DUWIT_VIDEO_HERO}
              poster={DUWIT_VIDEO_POSTER}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_40%,rgb(10_10_10/0.06)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function DuwitFrictionSection() {
  const reduceMotion = useReducedMotion() === true

  const fade = {
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: [0.22, 0.08, 0.19, 1] as const },
  }

  const pillColors = [
    "bg-orange-100 text-orange-950 border-orange-200/90",
    "bg-amber-50 text-amber-950 border-amber-200/85",
    "bg-sky-100 text-sky-950 border-sky-200/80",
    "bg-violet-100 text-violet-950 border-violet-200/75",
  ] as const

  return (
    <section className="duwit-story-block border-y border-[var(--color-drh-ink)]/08 bg-[var(--color-drh-surface)]/90 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
        <DuwitStoryStep n="02" label="Friction" />
        <p
          className="text-[0.68rem] font-medium tracking-[0.22em] text-[var(--color-drh-ink)]/40 uppercase"
          style={{ fontFamily: DUWIT_DISPLAY_FONT }}
        >
          The friction
        </p>
        <DuwitStoryTitle as="h2">
          I wanted a teacher. I got a hype man in a trench coat.
        </DuwitStoryTitle>
      </div>

      <motion.div className="mx-auto mt-10 max-w-2xl text-center" {...fade}>
        <p
          className="text-[1.05rem] leading-[1.75] text-[var(--color-drh-ink-muted)] sm:text-[1.12rem]"
          style={{ fontFamily: DUWIT_BODY_FONT }}
        >
          Since the GPT-3 era, I kept asking AI to{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            actually teach me something
          </strong>{" "}
          — follow me from zero to done, step by step. Instead I got the same
          performance: sunny vague reassurance,{" "}
          <FrictionMemePhrase /> and endless chatter that never hardens into a real plan.
        </p>
        <p
          className="mt-6 text-[1.05rem] leading-[1.75] text-[var(--color-drh-ink-muted)] sm:text-[1.12rem]"
          style={{ fontFamily: DUWIT_BODY_FONT }}
        >
          Where was the carefree creativity without the fluff? Why couldn&apos;t
          it get{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            serious with me
          </strong>{" "}
          — move from talk to structure, insist on teaching, hold the line on
          depth instead of joking around like the whole thing is a bit? I did
          not want babysitting. I wanted full{" "}
          <strong className="font-medium text-[var(--color-drh-ink)]/88">
            serious mode
          </strong>{" "}
          until the goal is real.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 0.08, 0.19, 1] }}
      >
        {DUWIT_FRICTION_VIBE_PILLS.map((label, i) => (
          <span
            key={label}
            className={`inline-flex rounded-full border px-4 py-2 text-[0.88rem] font-semibold tracking-[-0.02em] shadow-[0_8px_18px_rgb(10_10_10/0.05)] sm:text-[0.92rem] ${pillColors[i % pillColors.length]}`}
            style={{ fontFamily: DUWIT_BODY_FONT }}
          >
            {label}
          </span>
        ))}
      </motion.div>

      <motion.figure
        className="mx-auto mt-14 flex max-w-xl flex-col"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.85, ease: [0.22, 0.08, 0.19, 1] }}
      >
        <div className="overflow-hidden rounded-2xl border border-[var(--color-drh-ink)]/10 bg-white shadow-[0_22px_56px_rgb(10_10_10/0.07)]">
          <img
            src={DUWIT_FRICTION_ASSETS.youCan}
            alt="Cartoon: a chipper AI bot says “oh absolutely, you can do it!” while a young man replies “I literally can’t, it ain’t easy like that.”"
            className="block w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption
          className="mt-4 text-center text-[0.82rem] leading-relaxed text-[var(--color-drh-ink)]/48 sm:text-left"
          style={{ fontFamily: DUWIT_BODY_FONT }}
        >
          The mismatch: infinite optimism on one side, real difficulty on the
          other — tap the highlighted phrase above for the other side of that
          unserious energy.
        </figcaption>
      </motion.figure>

      <motion.div
        className="mx-auto mt-14 max-w-2xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.22, 0.08, 0.19, 1] }}
      >
        <p
          className="text-[1.12rem] font-medium leading-[1.65] tracking-[-0.02em] text-[var(--color-drh-ink)]/85 sm:text-[1.22rem]"
          style={{ fontFamily: DUWIT_BODY_FONT }}
        >
          So I built{" "}
          <DuwitWordmark className="font-[inherit] text-[var(--color-drh-ink)]/95" />
          : careful prompt engineering and product logic so the experience feels
          like a{" "}
          <strong className="font-semibold text-[var(--color-drh-ink)]">
            fully serious partner
          </strong>{" "}
          — it plans with you, teaches you on one step at a time, checks whether
          you actually got it, and stays in context until the work is done — not
          another vague chat that ducks the hard parts.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={DUWIT_TRY_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-[var(--color-drh-accent-orange)]/35 bg-[rgb(255_122_0/0.1)] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)]/55 hover:bg-[rgb(255_122_0/0.16)]"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            Try Duwit live
          </a>
          <a
            href={DUWIT_DESKTOP_APP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-black/80 bg-black px-5 py-2.5 text-[0.68rem] font-medium tracking-[0.18em] text-white/92 uppercase transition hover:bg-neutral-950 hover:text-white [corner-shape:squircle]"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            Try Desktop App
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export function DuwitFooter() {
  return (
    <footer className="duwit-story-block py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            More work
          </p>
          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-[var(--color-drh-ink)]/14 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-[var(--color-drh-accent-orange)] hover:bg-[rgb(255_122_0/0.08)]"
            style={{ fontFamily: DUWIT_DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {DUWIT_RECOMMENDED_WORKS.map((project, index) => (
            <DuwitRecommendedWorkCard
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
