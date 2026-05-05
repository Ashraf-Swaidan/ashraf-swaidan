import type { RefObject } from "react"
import { motion, useReducedMotion } from "motion/react"

import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"

import {
  TWODO_BODY_FONT,
  TWODO_DISPLAY_FONT,
  TWODO_FRICTION_PILLS,
  TWODO_LOGO,
  TWODO_TRY_URL,
  TWODO_VIDEO_HERO,
  TWODO_VIDEO_POSTER,
} from "./twodo-data"
import {
  TwodoEyebrow,
  TwodoProse,
  TwodoStoryStep,
  TwodoStoryTitle,
  TwodoWordmark,
} from "./twodo-ui"

const TWODO_RECOMMENDED_WORK_IDS = ["papion", "duwit"] as const
const TWODO_RECOMMENDED_WORKS = SELECTED_WORKS_PROJECTS.filter((project) =>
  TWODO_RECOMMENDED_WORK_IDS.includes(
    project.id as (typeof TWODO_RECOMMENDED_WORK_IDS)[number]
  )
)

export function TwodoHeroSection({
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
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgb(56 189 248 / 0.1) 0%, transparent 55%), radial-gradient(circle at 18% 72%, rgb(190 242 100 / 0.07) 0%, transparent 38%), linear-gradient(90deg, rgb(10 10 10 / 0.025) 1px, transparent 1px), linear-gradient(180deg, rgb(10 10 10 / 0.025) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
        }}
      />

      <div className="twodo-hero-inner relative z-10 mx-auto max-w-3xl">
        <header
          ref={heroNavRef}
          className="mb-14 flex items-center justify-between gap-4 sm:mb-16"
        >
          <a
            href="/"
            className="shrink-0 text-[0.68rem] font-medium tracking-[0.16em] text-[var(--color-drh-ink)]/42 uppercase transition hover:text-[var(--color-drh-ink)]"
            style={{ fontFamily: TWODO_DISPLAY_FONT }}
          >
            Back
          </a>
          <img
            src={TWODO_LOGO}
            alt="Twodo"
            className="h-9 w-9 shrink-0 object-contain opacity-95 sm:h-10 sm:w-10"
          />
        </header>

        <div className="text-center">
          <TwodoStoryStep n="01" label="Opening" />
          <p
            className="text-[0.68rem] font-medium text-[var(--color-drh-ink)]/40"
            style={{ fontFamily: TWODO_DISPLAY_FONT }}
          >
            <span className="tracking-[0.22em] uppercase">Case study</span>
            <span className="mx-2 text-[var(--color-drh-ink)]/22">·</span>
            <TwodoWordmark className="normal-case align-middle tracking-[0.06em]" />
          </p>
          <TwodoStoryTitle as="h1">
            Tasks with a one-click mindset: capture, sort, finish.
          </TwodoStoryTitle>
          <TwodoProse className="mx-auto mt-6 max-w-prose text-center">
            <TwodoWordmark className="font-[inherit] text-[var(--color-drh-ink)]/92" />{" "}
            is a live UX experiment. The surface stays calm on purpose so the
            product can chase the{" "}
            <strong className="font-medium text-[var(--color-drh-ink)]/88">
              smoothest path from thought to done
            </strong>
            , without turning every edit into a ceremony.
          </TwodoProse>
          <div className="mt-7 flex justify-center">
            <a
              href={TWODO_TRY_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex cursor-pointer items-center justify-center rounded-3xl border border-sky-400/40 bg-[rgb(56_189_248/0.12)] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-sky-500/55 hover:bg-[rgb(56_189_248/0.2)]"
              style={{ fontFamily: TWODO_DISPLAY_FONT }}
            >
              Try Twodo
            </a>
          </div>
          <div className="mx-auto mt-10 max-w-lg">
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
              style={{ fontFamily: TWODO_DISPLAY_FONT }}
            >
              {(
                [
                  {
                    label: "One-click mindset",
                    className:
                      "border border-sky-200/90 bg-sky-50 text-sky-950 shadow-[0_6px_18px_rgb(56_189_248/0.12)]",
                  },
                  {
                    label: "Projects",
                    className:
                      "border border-[var(--color-drh-ink)]/10 bg-white text-[var(--color-drh-ink)]/85 shadow-[0_6px_18px_rgb(10_10_10/0.05)]",
                  },
                  {
                    label: "Invites",
                    className:
                      "border border-lime-200/85 bg-lime-50/95 text-lime-950 shadow-[0_6px_18px_rgb(190_242_100/0.18)]",
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
              style={{ fontFamily: TWODO_BODY_FONT }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/45 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
              </span>
              <span>
                Fewer steps, faster feedback
                <span className="sr-only"> (speed indicator)</span>
              </span>
            </p>
            <p
              className="mt-3 text-center text-[0.68rem] tracking-[0.14em] text-[var(--color-drh-ink)]/40"
              style={{ fontFamily: TWODO_DISPLAY_FONT }}
            >
              React · Vite · Tailwind · Express · MongoDB
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-[rgb(56_189_248/0.08)] blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-drh-ink)]/10 bg-neutral-100 shadow-[0_28px_64px_rgb(10_10_10/0.1)] sm:rounded-2xl">
            <video
              className="aspect-video w-full object-cover"
              src={TWODO_VIDEO_HERO}
              poster={TWODO_VIDEO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_40%,rgb(10_10_10/0.06)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function TwodoFrictionSection() {
  const reduceMotion = useReducedMotion() === true

  const fade = {
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, ease: [0.22, 0.08, 0.19, 1] as const },
  }

  const pillStyles = [
    "bg-slate-100 text-slate-900 border-slate-200/8",
    "bg-sky-50 text-sky-950 border-sky-200/75",
    "bg-lime-50 text-lime-950 border-lime-200/75",
    "bg-white text-[var(--color-drh-ink)]/85 border-[var(--color-drh-ink)]/10",
    "bg-blue-50 text-blue-950 border-blue-200/75",
  ] as const

  return (
    <section className="twodo-story-block border-y border-sky-950/8 bg-white/80 px-5 py-20 backdrop-blur-sm sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <TwodoStoryStep n="02" label="Friction" />
        <TwodoEyebrow>When tools get in the way</TwodoEyebrow>
        <TwodoStoryTitle>
          Simple work should not require a tour of the interface first.
        </TwodoStoryTitle>
        <TwodoProse className="mx-auto mt-6 max-w-prose">
          Many task apps celebrate features with layers: every action hides
          behind another panel. Twodo pushes the opposite instinct. If a flow
          feels slow or ornamental, it gets challenged. The bar is whether a new
          task can land in the list with minimal friction and clear feedback.
        </TwodoProse>
      </div>

      <motion.div
        className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-2.5 sm:gap-3"
        initial={fade.initial}
        whileInView={fade.animate}
        viewport={{ once: true, margin: "-40px" }}
        transition={fade.transition}
      >
        {TWODO_FRICTION_PILLS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.08em] uppercase ${pillStyles[i % pillStyles.length]}`}
            style={{ fontFamily: TWODO_DISPLAY_FONT }}
          >
            {label}
          </span>
        ))}
      </motion.div>
    </section>
  )
}

export function TwodoOneClickSection() {
  return (
    <section className="twodo-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <TwodoStoryStep n="03" label="One click" />
        <TwodoEyebrow>Philosophy</TwodoEyebrow>
        <TwodoStoryTitle>
          Direct controls beat clever chrome when speed is the point.
        </TwodoStoryTitle>
        <TwodoProse className="mx-auto mt-6 max-w-prose">
          The work surface favors obvious entry points: a clear add control,
          search where you expect it, and inline actions that show up when they
          matter. Motion stays light so the UI reads as responsive, not
          theatrical.
        </TwodoProse>
        <ul
          className="mx-auto mt-10 max-w-lg space-y-3 text-left text-[0.9rem] leading-relaxed text-[var(--color-drh-ink-muted)]"
          style={{ fontFamily: TWODO_BODY_FONT }}
        >
          <li className="border-l-2 border-sky-500/55 pl-4">
            <strong className="font-medium text-[var(--color-drh-ink)]/84">
              Capture in one beat
            </strong>
            , then refine. The list stays the hero.
          </li>
          <li className="border-l-2 border-lime-500/45 pl-4">
            <strong className="font-medium text-[var(--color-drh-ink)]/84">
              Clarity over decoration
            </strong>
            : fewer competing panels, more readable hierarchy.
          </li>
        </ul>
      </div>
    </section>
  )
}

export function TwodoCollaborationSection() {
  return (
    <section className="twodo-story-block border-y border-[var(--color-drh-ink)]/8 bg-[#f4f9ff] px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <TwodoStoryStep n="04" label="Together" />
        <TwodoEyebrow>Projects and invites</TwodoEyebrow>
        <TwodoStoryTitle>
          Shared context without turning collaboration into a second product.
        </TwodoStoryTitle>
        <TwodoProse className="mx-auto mt-6 max-w-prose">
          A project is a shared container: tasks that belong together, whether
          that is a build, a launch pad, or a small team ritual. Invites pull
          people into the same list so updates stay aligned. The collaboration
          story still bows to the same rule: keep the UI fast and legible.
        </TwodoProse>
      </div>
    </section>
  )
}

export function TwodoFitSection() {
  return (
    <section className="twodo-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-prose text-center">
        <TwodoStoryStep n="05" label="Experiment" />
        <TwodoEyebrow>Why this exists</TwodoEyebrow>
        <TwodoStoryTitle>
          A running lab for what efficient really means on the web.
        </TwodoStoryTitle>
        <TwodoProse className="mx-auto mt-6 max-w-prose">
          <TwodoWordmark className="font-[inherit] text-[var(--color-drh-ink)]/90" />{" "}
          is not trying to ship a bloated productivity suite. It is trying to
          keep tightening the loop: fewer clicks, clearer paths, and honest
          feedback when something still feels slow. The stack supports that
          loop, but the product judge is always the interaction.
        </TwodoProse>
      </div>
    </section>
  )
}

export function TwodoFooter() {
  return (
    <footer className="twodo-story-block py-12 sm:py-16">
      <div className="w-full">
        <div className="flex items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <p
            className="text-[0.68rem] font-medium tracking-[0.2em] text-[var(--color-drh-ink)]/38 uppercase"
            style={{ fontFamily: TWODO_DISPLAY_FONT }}
          >
            More work
          </p>
          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-sky-900/16 px-5 py-2.5 text-[0.74rem] font-semibold tracking-[0.16em] text-[var(--color-drh-ink)] uppercase transition hover:border-sky-500/45 hover:bg-sky-50/95"
            style={{ fontFamily: TWODO_DISPLAY_FONT }}
          >
            Portfolio home
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 sm:mt-12 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-8">
          {TWODO_RECOMMENDED_WORKS.map((project, index) => (
            <a
              key={project.id}
              href={project.href}
              className={`group block overflow-hidden rounded-[1.65rem] border border-[var(--color-drh-ink)]/10 bg-[var(--color-drh-surface)] shadow-[0_28px_70px_rgb(10_10_10/0.1)] sm:rounded-[2rem] ${
                index === 0 ? "lg:justify-self-end" : "lg:justify-self-start"
              }`}
            >
              <article className="text-left">
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--color-drh-ink)] lg:w-[min(40vw,34rem)]">
                  <img
                    src={project.imageSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    src={project.videoSrc}
                    muted
                    loop
                    playsInline
                    preload="metadata"
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
                      style={{ fontFamily: TWODO_DISPLAY_FONT }}
                    >
                      {project.title}
                    </p>
                    <span
                      className="mt-5 inline-flex rounded-full border border-white/24 bg-white/12 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.16em] text-white/72 uppercase backdrop-blur-md"
                      style={{ fontFamily: TWODO_DISPLAY_FONT }}
                    >
                      Case study
                    </span>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
