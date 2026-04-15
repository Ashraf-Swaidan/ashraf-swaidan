import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react"

import { AnimatedWord } from "@/components/landing/AnimatedWord"
import {
  HERO_MARQUEE_COLOR_CYCLE,
  HERO_MARQUEE_SEGMENTS,
  type HeroLoudImportance,
  type HeroSoftImportance,
} from "@/components/landing/hero-marquee-data"
import { COL } from "@/components/landing/one-system-flow/colors"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Swap this value while testing different background typefaces.
// Keep marquee text size constant across breakpoints.
const HERO_MARQUEE_FONT_SIZE = "12.5rem"
const HERO_VIBRANT_ORANGE = "#ff7a00"
const HERO_LEBANESE_COLOR = "#84cc16"
const HERO_PRIMARY_COLOR_CYCLE = [
  COL.ink,
  HERO_VIBRANT_ORANGE,
  COL.lavender,
  COL.plum,
  "#ff4fa3",
] as const
const HERO_SECONDARY_COLOR_CYCLE = [
  "#7c3aed",
  "#c026d3",
  COL.plum,
] as const
const HERO_MARQUEE_LOUD_FONTS = [
  '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif',
  "var(--font-hero-intro)",
  "var(--font-hero-quote)",
  "var(--font-hero-greeting)",
  '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif',
]
const HERO_MARQUEE_SOFT_FONTS = [
  "var(--font-hero-quote)",
  '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif',
  "var(--font-hero-intro)",
  '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif',
  "var(--font-hero-greeting)",
]
const HERO_MARQUEE_SEPARATOR_FONTS = [
  "var(--font-hero-intro)",
  '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif',
  "var(--font-hero-quote)",
]
const HERO_BUILDER_FONT = '"Druk Cond Super", "Anton", var(--font-hero-intro), sans-serif'
const HERO_FIGURING_FONT = "var(--font-hero-greeting)"
const HERO_SHOW_FOREGROUND = false

function getMarqueeFontFamily(fonts: string[], idx: number) {
  return fonts[idx % fonts.length]
}

function MarqueeWords({ reduceMotion }: { reduceMotion: boolean }) {
  let loudSoftIdx = 0
  let sepIdx = 0
  let primaryIdx = 0
  let secondaryIdx = 0

  return (
    <>
      {HERO_MARQUEE_SEGMENTS.map((seg, i) => {
        if (seg.t === "l") {
          const importance: HeroLoudImportance = seg.importance ?? "secondary"
          const isPrimary = importance === "primary"
          const c = isPrimary
            ? HERO_PRIMARY_COLOR_CYCLE[primaryIdx++ % HERO_PRIMARY_COLOR_CYCLE.length]
            : HERO_SECONDARY_COLOR_CYCLE[secondaryIdx++ % HERO_SECONDARY_COLOR_CYCLE.length]
          const wordColor = seg.text.toLowerCase() === "lebanese" ? HERO_LEBANESE_COLOR : c
          loudSoftIdx++
          const fontFamily =
            seg.text.toLowerCase() === "builder"
              ? HERO_BUILDER_FONT
              : seg.text.toLowerCase() === "figuring"
                ? HERO_FIGURING_FONT
              : getMarqueeFontFamily(HERO_MARQUEE_LOUD_FONTS, loudSoftIdx - 1)
          const baseFontSize = isPrimary ? 1.15 : 0.78
          const fontSize = `${baseFontSize}em`
          const loudClass =
            isPrimary
              ? "inline-block font-black uppercase tracking-[0.02em]"
              : "inline-block font-semibold lowercase tracking-[0.008em] opacity-90"
          const isDeveloperWord = seg.text.toLowerCase() === "developer"

          if (seg.theme) {
            return (
              <AnimatedWord
                key={i}
                text={seg.text}
                color={wordColor}
                theme={seg.theme}
                reduceMotion={reduceMotion}
                className={cn(loudClass, isDeveloperWord && "tracking-[0.002em]")}
                style={{
                  fontFamily,
                  fontSize,
                  ...(isDeveloperWord ? { marginRight: "-0.03em" } : {}),
                }}
              />
            )
          }

          return (
            <span
              key={i}
              className={cn(loudClass, isDeveloperWord && "tracking-[0.002em]")}
              style={{
                color: wordColor,
                fontFamily,
                fontSize,
                ...(isDeveloperWord ? { marginRight: "-0.03em" } : {}),
              }}
            >
              {seg.text}
            </span>
          )
        }
        if (seg.t === "s") {
          const importance: HeroSoftImportance = seg.importance ?? "normal"
          const isLow = importance === "low"
          const c =
            HERO_SECONDARY_COLOR_CYCLE[
              loudSoftIdx % HERO_SECONDARY_COLOR_CYCLE.length
            ]
          loudSoftIdx++
          const fontFamily = getMarqueeFontFamily(HERO_MARQUEE_SOFT_FONTS, loudSoftIdx - 1)
          const fontSize = isLow ? "0.62em" : "0.72em"
          return (
            <span
              key={i}
              className={cn(
                "px-[0.12em] normal-case tracking-[0.01em]",
                isLow ? "font-normal" : "font-medium",
              )}
              style={{ color: c, opacity: isLow ? 0.62 : 0.98, fontFamily, fontSize }}
            >
              {seg.text}
            </span>
          )
        }
        if (seg.t === "sep") {
          const c =
            HERO_MARQUEE_COLOR_CYCLE[sepIdx % HERO_MARQUEE_COLOR_CYCLE.length]
          sepIdx++
          const fontFamily = getMarqueeFontFamily(HERO_MARQUEE_SEPARATOR_FONTS, sepIdx - 1)
          const fontSize = "0.72em"
          return (
            <span
              key={i}
              className="px-[0.2em] font-light"
              style={{ color: c, opacity: 0.9, fontFamily, fontSize }}
            >
              ·
            </span>
          )
        }
        return <span key={i}> </span>
      })}
    </>
  )
}

type MarqueeRowProps = {
  direction: "left" | "right"
  duration: number
  phaseOffset?: number
  className?: string
  reduceMotion: boolean
  tweenRef: MutableRefObject<(gsap.core.Tween | null)[]>
  tweenIndex: number
  children: ReactNode
}

function MarqueeRow({
  direction,
  duration,
  phaseOffset = 0,
  className,
  reduceMotion,
  tweenRef,
  tweenIndex,
  children,
}: MarqueeRowProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const track = trackRef.current
      const list = tweenRef.current
      const clearTween = () => {
        const prev = list[tweenIndex]
        prev?.kill()
        list[tweenIndex] = null
      }

      if (!root || !track || reduceMotion) {
        clearTween()
        gsap.set(track, { x: 0 })
        return
      }

      const segment = track.querySelector("[data-marquee-segment]") as HTMLElement | null

      const build = () => {
        clearTween()
        const w = segment?.offsetWidth ?? 0
        if (w === 0) return

        let tween: gsap.core.Tween
        if (direction === "left") {
          gsap.set(track, { x: 0 })
          tween = gsap.to(track, {
            x: -w,
            duration,
            ease: "none",
            repeat: -1,
          })
        } else {
          gsap.set(track, { x: -w })
          tween = gsap.to(track, {
            x: 0,
            duration,
            ease: "none",
            repeat: -1,
          })
        }
        tween.totalProgress(gsap.utils.wrap(0, 1, phaseOffset))
        list[tweenIndex] = tween
      }

      build()
      const ro = new ResizeObserver(() => {
        build()
        ScrollTrigger.refresh()
      })
      ro.observe(root)

      return () => {
        ro.disconnect()
        clearTween()
      }
    },
    {
      scope: rootRef,
      dependencies: [direction, duration, phaseOffset, reduceMotion, tweenIndex],
      revertOnUpdate: true,
    },
  )

  return (
    <div
      ref={rootRef}
      data-marquee-row
      className={cn(
        "pointer-events-none relative z-[1] select-none overflow-hidden opacity-[0.95]",
        className,
      )}
      aria-hidden
    >
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap will-change-transform"
        style={{
          fontSize: HERO_MARQUEE_FONT_SIZE,
        }}
      >
        <span
          data-marquee-segment
          className="inline-block shrink-0 pr-[1.25em] leading-[0.88]"
        >
          {children}
        </span>
        <span
          data-marquee-segment
          className="inline-block shrink-0 pr-[1.25em] leading-[0.88]"
        >
          {children}
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  const marqueeTweensRef = useRef<(gsap.core.Tween | null)[]>([null, null, null])

  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.scroll() > 12) setHasScrolled(true)
      },
    })
    return () => {
      st.kill()
    }
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || reduceMotion) return

      const rows = section.querySelectorAll<HTMLElement>("[data-marquee-row]")

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.45,
        onUpdate: (self) => {
          const mult = 1 + self.progress * 0.35
          marqueeTweensRef.current.forEach((t) => {
            t?.timeScale(mult)
          })
          const opacity = 0.95 + self.progress * 0.05
          gsap.set(rows, { opacity })
        },
      })

      return () => {
        st.kill()
        marqueeTweensRef.current.forEach((t) => t?.timeScale(1))
      }
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  )

  const rowConfigs = [
    { direction: "left" as const, duration: 85, tweenIndex: 0, phaseOffset: 0 },
    { direction: "right" as const, duration: 115, tweenIndex: 1, phaseOffset: 0.36 },
    { direction: "left" as const, duration: 145, tweenIndex: 2, phaseOffset: 0.68 },
  ]

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate h-svh min-h-svh overflow-hidden bg-[var(--color-hero-bg)] text-[var(--color-hero-ink)]",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        aria-hidden
      >
        <div className="flex h-full flex-col items-stretch justify-center gap-1 py-8 md:gap-1.5 md:py-12">
          {rowConfigs.map((row) => (
            <div key={row.tweenIndex} className="relative shrink-0">
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: "transparent" }}
              />
              <MarqueeRow
                direction={row.direction}
                duration={row.duration}
                phaseOffset={row.phaseOffset}
                className="shrink-0"
                reduceMotion={reduceMotion}
                tweenRef={marqueeTweensRef}
                tweenIndex={row.tweenIndex}
              >
                <MarqueeWords reduceMotion={reduceMotion} />
              </MarqueeRow>
            </div>
          ))}
        </div>
      </div>

      {HERO_SHOW_FOREGROUND ? (
        <motion.div
          className="relative z-10 flex min-h-svh items-center justify-center px-5 sm:px-8"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div
            className="w-full max-w-md rounded-[1.35rem] border border-[var(--color-hero-glass-border)] bg-[var(--color-hero-glass)] px-6 py-4 shadow-[0_20px_60px_-12px_rgb(0_0_0_/_14%)] backdrop-blur-2xl backdrop-saturate-200 sm:max-w-lg sm:rounded-[1.5rem] sm:px-7 sm:py-5"
          >
            <div className="text-left">
              <p
                className="max-w-[28ch] text-pretty text-[clamp(0.98rem,2.55vw,1.08rem)] font-normal leading-[1.55] tracking-[0.01em] text-[var(--color-hero-ink)]/86"
                style={{ fontFamily: "var(--font-hero-quote)" }}
              >
                There is a lot we can do through screens.
              </p>
              <p
                className="mt-2 max-w-[26ch] text-pretty text-[clamp(1.14rem,3.1vw,1.38rem)] font-medium leading-[1.38] tracking-[-0.03em] text-[var(--color-hero-ink)]"
                style={{ fontFamily: "var(--font-hero-quote)", fontOpticalSizing: "auto" }}
              >
                It seems there&apos;s{" "}
                <span style={{ color: COL.brown }}>never enough</span> of it.
              </p>
            </div>

            <div className="mt-4 text-left">
              <p
                className="text-[clamp(1.75rem,4.2vw,2.2rem)] font-semibold leading-tight text-[var(--color-hero-ink)]"
                style={{ fontFamily: "var(--font-hero-greeting)" }}
              >
                Hey there
              </p>
              <p
                className="mt-1.5 text-[clamp(1rem,2.5vw,1.125rem)] font-normal leading-snug tracking-normal text-[var(--color-hero-ink)]/92"
                style={{ fontFamily: "var(--font-hero-intro)" }}
              >
                I am Ashraf Swaidan, I do a lot of stuff.
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </section>
  )
}
