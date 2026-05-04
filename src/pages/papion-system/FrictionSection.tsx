import { motion, useReducedMotion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import {
  BODY_FONT,
  DISPLAY_FONT,
  EXCEL_FOOTNOTE,
  EXCEL_ICON_SRC,
  FRICTION_CLOSING_1,
  FRICTION_CLOSING_2,
  FRICTION_LINE1,
  FRICTION_PILL_STYLES,
  FRICTION_PILLS,
  getFrictionPillDelay,
  sleep,
} from "./papion-data"
import { Eyebrow, StoryStep, StoryTitle } from "./papion-ui"

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
  const reduceMotion = useReducedMotion() === true
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [line1, setLine1] = useState("")
  const [pillCount, setPillCount] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [showLotNote, setShowLotNote] = useState(false)
  const [showBlockA, setShowBlockA] = useState(false)
  const [showBlockB, setShowBlockB] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el || reduceMotion) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.06, rootMargin: "120px 0px -10% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) {
      setLine1(FRICTION_LINE1)
      setPillCount(FRICTION_PILLS.length)
      setShowMore(true)
      setShowLotNote(true)
      setShowBlockA(true)
      setShowBlockB(true)
      setBusy(false)
      return
    }

    if (!inView) return

    let cancelled = false
    setBusy(true)
    setLine1("")
    setPillCount(0)
    setShowMore(false)
    setShowLotNote(false)
    setShowBlockA(false)
    setShowBlockB(false)

    void (async () => {
      for (let i = 1; i <= FRICTION_LINE1.length; i++) {
        if (cancelled) return
        setLine1(FRICTION_LINE1.slice(0, i))
        await sleep(44)
      }
      await sleep(940)
      for (let p = 1; p <= FRICTION_PILLS.length; p++) {
        if (cancelled) return
        setPillCount(p)
        await sleep(getFrictionPillDelay(p - 1))
      }
      await sleep(560)
      if (!cancelled) setShowMore(true)
      await sleep(500)
      if (!cancelled) setShowLotNote(true)
      await sleep(920)
      if (!cancelled) setShowBlockA(true)
      await sleep(620)
      if (!cancelled) setShowBlockB(true)
      if (!cancelled) setBusy(false)
    })()

    return () => {
      cancelled = true
      setBusy(false)
    }
  }, [reduceMotion, inView])

  const showCursor =
    !reduceMotion &&
    inView &&
    (line1.length < FRICTION_LINE1.length ||
      (line1 === FRICTION_LINE1 && pillCount === 0 && !showMore))

  const showPlaceholder = !reduceMotion && !inView

  const closingTextClass =
    "text-[1.18rem] font-medium leading-[1.65] tracking-[-0.022em] text-[var(--color-drh-ink)]/82 sm:text-[1.32rem] md:text-[1.42rem]"

  const softFadeTransition = {
    duration: 0.72,
    ease: [0.22, 0.08, 0.19, 1] as const,
  }

  return (
    <div
      ref={rootRef}
      className="text-center text-[var(--color-drh-ink)]"
      aria-busy={busy && !reduceMotion && inView ? true : undefined}
    >
      {showPlaceholder ? (
        <div
          className="flex min-h-[10rem] flex-col justify-center"
          aria-hidden
        >
          <div
            className="flex items-center gap-1.5 text-[0.72rem] tracking-[0.12em] text-[var(--color-drh-ink)]/28 uppercase"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            <span className="inline-flex gap-1">
              <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--color-drh-ink)]/30 [animation-delay:0ms]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--color-drh-ink)]/30 [animation-delay:150ms]" />
              <span className="h-1 w-1 animate-pulse rounded-full bg-[var(--color-drh-ink)]/30 [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      ) : (
        <>
          <p
            className="text-[1.28rem] leading-[1.65] tracking-[-0.025em] text-[var(--color-drh-ink)]/80 sm:text-[1.55rem] md:text-[1.8rem]"
            style={{ fontFamily: BODY_FONT }}
          >
            <span className="text-pretty">{line1}</span>
            {showCursor ? (
              <span
                className="ml-0.5 inline-block w-0.5 translate-y-px animate-pulse bg-[var(--color-drh-accent-orange)]"
                style={{ height: "1.1em" }}
                aria-hidden
              />
            ) : null}
          </p>

          {(pillCount > 0 || showMore) && (
            <motion.div
              className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5"
              initial={false}
            >
              {FRICTION_PILLS.slice(0, pillCount).map((label, i) => (
                <motion.span
                  key={label}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 5, scale: 0.985 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={softFadeTransition}
                  className={`inline-flex rounded-full px-4 py-2 text-[0.95rem] font-semibold tracking-[-0.02em] shadow-[0_8px_18px_rgb(10_10_10/0.06)] md:text-[1.02rem] ${FRICTION_PILL_STYLES[i % FRICTION_PILL_STYLES.length]}`}
                  style={{ fontFamily: BODY_FONT }}
                >
                  {label}
                </motion.span>
              ))}
              {showMore && (
                <motion.span
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 5, scale: 0.985 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...softFadeTransition, duration: 0.85 }}
                  className="inline-flex items-center rounded-full bg-[var(--color-drh-ink)] px-4 py-2 text-[0.95rem] font-medium italic text-white shadow-[0_10px_26px_rgb(10_10_10/0.1)] md:text-[1.02rem]"
                  style={{ fontFamily: BODY_FONT }}
                >
                  and more…
                </motion.span>
              )}
            </motion.div>
          )}

          {showLotNote && (
            <motion.p
              className="mt-4 text-[0.95rem] font-medium text-[var(--color-drh-ink)]/50"
              style={{ fontFamily: BODY_FONT }}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 0.08, 0.19, 1] }}
            >
              Yeah, a lot.
            </motion.p>
          )}

          {showBlockA && (
            <motion.div
              className="mx-auto mt-10 max-w-2xl space-y-4"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 0.08, 0.19, 1] }}
            >
              <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
                {FRICTION_CLOSING_1}
              </p>
              <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
                {FRICTION_CLOSING_2}
              </p>
            </motion.div>
          )}

          {showBlockB && (
            <motion.div
              className="mx-auto mt-8 max-w-2xl space-y-5"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.95,
                ease: [0.22, 0.08, 0.19, 1],
                delay: 0.06,
              }}
            >
              <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
                However, if your reflex is still to reach for{" "}
                <ExcelFrictionFootnote />, that&apos;s fair.
              </p>
              <p className={closingTextClass} style={{ fontFamily: BODY_FONT }}>
                We built Papion so the team does not live there.
              </p>
            </motion.div>
          )}
        </>
      )}
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
