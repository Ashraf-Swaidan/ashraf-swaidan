import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react"

import { AnimatedWord } from "@/components/landing/AnimatedWord"
import {
  HERO_MARQUEE_COLOR_CYCLE,
  HERO_MARQUEE_SEGMENTS,
  HERO_ROW_WASHES,
  type HeroLoudImportance,
} from "@/components/landing/hero-marquee-data"
import { COL } from "@/components/landing/one-system-flow/colors"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

function MarqueeWords({ reduceMotion }: { reduceMotion: boolean }) {
  let loudSoftIdx = 0
  let sepIdx = 0

  return (
    <>
      {HERO_MARQUEE_SEGMENTS.map((seg, i) => {
        if (seg.t === "l") {
          const c =
            HERO_MARQUEE_COLOR_CYCLE[
              loudSoftIdx % HERO_MARQUEE_COLOR_CYCLE.length
            ]
          loudSoftIdx++
          const importance: HeroLoudImportance = seg.importance ?? "secondary"
          const fontSize = importance === "primary" ? "1.15em" : "1em"
          const loudClass =
            "inline-block font-black uppercase tracking-[-0.04em]"

          if (seg.theme) {
            return (
              <AnimatedWord
                key={i}
                text={seg.text}
                color={c}
                theme={seg.theme}
                reduceMotion={reduceMotion}
                className={loudClass}
                style={{ fontSize }}
              />
            )
          }

          return (
            <span
              key={i}
              className={loudClass}
              style={{ color: c, fontSize }}
            >
              {seg.text}
            </span>
          )
        }
        if (seg.t === "s") {
          const c =
            HERO_MARQUEE_COLOR_CYCLE[
              loudSoftIdx % HERO_MARQUEE_COLOR_CYCLE.length
            ]
          loudSoftIdx++
          return (
            <span
              key={i}
              className="px-[0.12em] font-medium normal-case tracking-tight"
              style={{ color: c, opacity: 0.98, fontSize: "0.85em" }}
            >
              {seg.text}
            </span>
          )
        }
        if (seg.t === "sep") {
          const c =
            HERO_MARQUEE_COLOR_CYCLE[sepIdx % HERO_MARQUEE_COLOR_CYCLE.length]
          sepIdx++
          return (
            <span
              key={i}
              className="px-[0.2em] font-light"
              style={{ color: c, opacity: 0.9 }}
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
  className?: string
  reduceMotion: boolean
  tweenRef: MutableRefObject<(gsap.core.Tween | null)[]>
  tweenIndex: number
  children: ReactNode
}

function MarqueeRow({
  direction,
  duration,
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
      dependencies: [direction, duration, reduceMotion, tweenIndex],
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
        className="flex w-max whitespace-nowrap will-change-transform font-sans max-md:text-[clamp(3.25rem,19vw,7.5rem)] md:text-[clamp(4.5rem,17vw,11.5rem)] lg:text-[clamp(5rem,16vw,12.5rem)]"
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
    { direction: "left" as const, duration: 85, tweenIndex: 0 },
    { direction: "right" as const, duration: 115, tweenIndex: 1 },
    { direction: "left" as const, duration: 145, tweenIndex: 2 },
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
          {rowConfigs.map((row, idx) => (
            <div key={row.tweenIndex} className="relative shrink-0">
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: `linear-gradient(90deg, ${HERO_ROW_WASHES[idx]} 0%, transparent 62%)`,
                }}
              />
              <MarqueeRow
                direction={row.direction}
                duration={row.duration}
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

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={false}
        animate={{
          opacity: hasScrolled ? 0 : 1,
          y: hasScrolled ? 6 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="h-7 w-px origin-top bg-black/20" />
          <motion.span
            className="block h-2 w-2 rotate-45 border-r border-b border-black/30"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, 5, 0],
                    opacity: [0.35, 0.85, 0.35],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 2.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
            }
          />
        </div>
      </motion.div>
    </section>
  )
}
