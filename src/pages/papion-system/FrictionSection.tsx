import { useId } from "react"

import {
  BODY_FONT,
  EXCEL_FOOTNOTE,
  EXCEL_ICON_SRC,
  FRICTION_CLOSING_1,
  FRICTION_CLOSING_2,
  FRICTION_LINE1_TAIL,
  FRICTION_PILL_STYLES,
  FRICTION_PILLS,
} from "./papion-data"
import { Eyebrow, PapionWordmark, StoryStep, StoryTitle } from "./papion-ui"

function ExcelFrictionFootnote() {
  const tipId = useId()
  return (
    <span className="group relative inline-flex align-middle [-webkit-tap-highlight-color:transparent]">
      <button
        type="button"
        className="relative mx-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-1 align-middle text-[var(--color-drh-ink)]/70 transition hover:text-[var(--color-drh-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-drh-ink)]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-drh-bg)]"
        aria-label="Footnote about spreadsheets"
        aria-describedby={tipId}
      >
        <img
          src={EXCEL_ICON_SRC}
          alt=""
          className="pointer-events-none size-6 object-contain"
          aria-hidden
        />
        <span
          className="text-[0.96em] font-medium"
          style={{ fontFamily: BODY_FONT }}
        >
          Excel
        </span>
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 rounded-xl border border-[var(--color-drh-ink)]/12 bg-[var(--color-drh-ink)] px-3.5 py-3 text-left text-[0.78rem] leading-relaxed text-white opacity-0 shadow-[0_16px_40px_rgb(0_0_0/0.2)] transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 max-sm:left-0 max-sm:translate-x-0"
        style={{ fontFamily: BODY_FONT }}
      >
        {EXCEL_FOOTNOTE}
      </span>
    </span>
  )
}

function FrictionNarrative() {
  const closingTextClass =
    "text-[1.18rem] font-medium leading-[1.65] tracking-[-0.022em] text-[var(--color-drh-ink)]/82 sm:text-[1.32rem] md:text-[1.42rem]"

  return (
    <div className="text-center text-[var(--color-drh-ink)]">
      <p
        className="text-[1.28rem] leading-[1.65] tracking-[-0.025em] text-[var(--color-drh-ink)]/80 sm:text-[1.55rem] md:text-[1.8rem]"
        style={{ fontFamily: BODY_FONT }}
      >
        <PapionWordmark className="font-[inherit]" />
        <span className="text-pretty">{FRICTION_LINE1_TAIL}</span>
      </p>

      <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5">
        {FRICTION_PILLS.map((label, i) => (
          <span
            key={label}
            className={`inline-flex rounded-full px-4 py-2 text-[0.95rem] font-semibold tracking-[-0.02em] shadow-[0_8px_18px_rgb(10_10_10/0.06)] md:text-[1.02rem] ${FRICTION_PILL_STYLES[i % FRICTION_PILL_STYLES.length]}`}
            style={{ fontFamily: BODY_FONT }}
          >
            {label}
          </span>
        ))}
        <span
          className="inline-flex items-center rounded-full bg-[var(--color-drh-ink)] px-4 py-2 text-[0.95rem] font-medium italic text-white shadow-[0_10px_26px_rgb(10_10_10/0.1)] md:text-[1.02rem]"
          style={{ fontFamily: BODY_FONT }}
        >
          and more…
        </span>
      </div>

      <p
        className="mt-4 text-[0.95rem] font-medium text-[var(--color-drh-ink)]/50"
        style={{ fontFamily: BODY_FONT }}
      >
        Yeah, a lot.
      </p>

      <div className="mx-auto mt-10 max-w-2xl space-y-4">
        <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
          {FRICTION_CLOSING_1}
        </p>
        <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
          {FRICTION_CLOSING_2}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-5">
        <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
          However, if your reflex is still to reach for{" "}
          <ExcelFrictionFootnote />, that&apos;s fair.
        </p>
        <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
          We built <PapionWordmark className="font-[inherit]" /> so the team does
          not live there.
        </p>
      </div>
    </div>
  )
}

export function FrictionSection() {
  return (
    <section className="papion-story-block px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
        <StoryStep n="02" label="Friction" />
        <Eyebrow>The friction</Eyebrow>
        <StoryTitle>
          Too much human-scale complexity for a spreadsheet, or a generic
          one-size-fits-all app.
        </StoryTitle>
      </div>

      <div className="mx-auto mt-14 max-w-3xl lg:max-w-4xl">
        <FrictionNarrative />
      </div>
    </section>
  )
}
