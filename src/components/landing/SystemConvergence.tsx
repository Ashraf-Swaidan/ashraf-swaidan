import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useId, useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WORDS = [
  "INVENTORY",
  "SALES",
  "CUSTOMERS",
  "INSIGHTS",
  "SUPPLIERS",
  "ROLES",
  "EXPENSES",
  "WALLETS",
  "SECURITY",
] as const

const TAGLINE = "Yes, for real."

/** Scroll distance while pinned (px) — long runway so you can feel each phase. */
const PIN_SCROLL_PX = 9600

const WORD_STAGGER = 0.52
const POP_DURATION = 0.36
/** Extra timeline after the last word is fully visible before merge (scroll past list). */
const HOLD_AFTER_LAST_WORD = 2.45

/** Merge: ease-in pull → ease-out crush (timeline seconds, mapped to scroll). */
const MERGE_IN = 0.72
const MERGE_OUT = 0.9

const BUBBLE_COUNT = 20

function blackHoleTarget(stage: HTMLElement, pullY: number) {
  const sr = stage.getBoundingClientRect()
  return {
    x: sr.left + sr.width / 2,
    y: sr.bottom - 28 + pullY,
  }
}

export function SystemConvergence() {
  const uid = useId().replace(/:/g, "")
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const outcomeRef = useRef<HTMLDivElement>(null)
  const systemWrapRef = useRef<HTMLDivElement>(null)
  const systemRef = useRef<HTMLDivElement>(null)
  const bubbleLayerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    (_, contextSafe) => {
      const section = sectionRef.current
      const stage = stageRef.current
      const list = listRef.current
      const outcome = outcomeRef.current
      const system = systemRef.current
      const bubbleLayer = bubbleLayerRef.current
      const systemWrap = systemWrapRef.current
      if (!section || !stage || !list || !outcome || !system || !bubbleLayer || !systemWrap || !contextSafe) {
        return
      }

      const words = wordRefs.current.filter(Boolean) as HTMLDivElement[]
      const tagChars = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".sys-tag-char"))
      const bubbles = gsap.utils.toArray<HTMLElement>(bubbleLayer.querySelectorAll(".sys-bubble"))

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      const applyReduced = contextSafe(() => {
        gsap.set(words, { clearProps: "all" })
        gsap.set(list, { autoAlpha: 0 })
        gsap.set(outcome, { autoAlpha: 1 })
        gsap.set(system, { scale: 1, clearProps: "transform" })
        gsap.set(bubbles, { clearProps: "all", opacity: 0 })
        gsap.set(tagChars, { opacity: 1, clearProps: "all" })
      })

      if (reduceMotion) {
        applyReduced()
        return
      }

      const lastWordEnd = (WORDS.length - 1) * WORD_STAGGER + POP_DURATION
      const mergeStart = lastWordEnd + HOLD_AFTER_LAST_WORD

      gsap.set(words, {
        opacity: 0,
        y: -56,
        scale: 0.88,
        x: 0,
        skewX: 0,
        skewY: 0,
        transformOrigin: "50% 0%",
        force3D: true,
      })

      const hole0 = blackHoleTarget(stage, 24)
      const hole1 = blackHoleTarget(stage, 72)
      const finalDx = words.map((el) => {
        const r = el.getBoundingClientRect()
        return hole1.x - (r.left + r.width / 2)
      })
      const finalDy = words.map((el) => {
        const r = el.getBoundingClientRect()
        return hole1.y - (r.top + r.height / 2)
      })
      const skewPull = words.map((el) => {
        const r = el.getBoundingClientRect()
        return (r.left + r.width / 2 - hole0.x) * 0.014
      })
      const skewCrush = words.map((el) => {
        const r = el.getBoundingClientRect()
        return (r.left + r.width / 2 - hole0.x) * 0.024
      })
      gsap.set(list, { autoAlpha: 1 })
      gsap.set(outcome, { autoAlpha: 0 })
      gsap.set(system, { scale: 1, force3D: true })
      gsap.set(tagChars, { opacity: 0 })
      gsap.set(bubbles, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
        force3D: true,
      })

      bubbles.forEach((bubble, i) => {
        const ang = (i / BUBBLE_COUNT) * Math.PI * 2 + (i % 5) * 0.15
        const rad = 48 + (i % 4) * 14 + (i % 3) * 6
        gsap.set(bubble, {
          x: Math.cos(ang) * rad,
          y: Math.sin(ang) * rad,
        })
      })

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${PIN_SCROLL_PX}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      words.forEach((w, i) => {
        tl.fromTo(
          w,
          { opacity: 0, y: -56, scale: 0.88 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: POP_DURATION,
            ease: "back.out(1.88)",
            force3D: true,
          },
          i * WORD_STAGGER,
        )
      })

      tl.to(
        words,
        {
          duration: MERGE_IN,
          ease: "power3.in",
          transformOrigin: "50% 0%",
          x: (i) => finalDx[i]! * 0.52,
          y: (i) => finalDy[i]! * 0.42 + 48,
          scaleX: 0.78,
          scaleY: 0.34,
          skewY: 6,
          skewX: (i) => skewPull[i] ?? 0,
        },
        mergeStart,
      ).to(
        words,
        {
          duration: MERGE_OUT,
          ease: "power2.out",
          transformOrigin: "50% 0%",
          x: (i) => finalDx[i]! * 1.08,
          y: (i) => finalDy[i]! * 1.22 + 96,
          scaleX: 0.22,
          scaleY: 0.018,
          skewY: 14,
          skewX: (i) => skewCrush[i] ?? 0,
        },
        mergeStart + MERGE_IN,
      )

      const swapTime = mergeStart + MERGE_IN + MERGE_OUT
      tl.to(list, { autoAlpha: 0, duration: 0.08, ease: "none" }, swapTime).to(
        outcome,
        { autoAlpha: 1, duration: 0.08, ease: "none" },
        swapTime,
      )

      tl.fromTo(
        system,
        { scale: 0.14, y: 24, force3D: true },
        {
          scale: 1,
          y: 0,
          duration: 0.95,
          ease: "elastic.out(1.08, 0.34)",
          force3D: true,
        },
        swapTime,
      )

      tl.fromTo(
        bubbles,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.72,
          duration: 0.38,
          stagger: { each: 0.028, from: "random" },
          ease: "power2.out",
        },
        swapTime + 0.06,
      ).to(
        bubbles,
        {
          scale: 2.4,
          opacity: 0,
          duration: 0.62,
          stagger: { each: 0.02, from: "edges" },
          ease: "power1.in",
        },
        swapTime + 0.35,
      )

      const tagStart = swapTime + 0.92
      tl.to(
        tagChars,
        {
          opacity: 1,
          duration: 0.09,
          stagger: 0.034,
          ease: "power1.out",
        },
        tagStart,
      )

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: sectionRef },
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Tall approach so you can scroll a lot before the pinned sequence */}
      <div className="min-h-[200vh]" aria-hidden />

      <section
        ref={sectionRef}
        className="relative px-4"
        aria-label="Product capabilities converging into one system"
      >
        <div
          ref={stageRef}
          className="relative mx-auto flex min-h-[min(78vh,680px)] w-full max-w-4xl items-center justify-center py-8"
        >
          <div
            ref={listRef}
            className="relative z-10 flex w-full flex-col items-center justify-center gap-0.5"
          >
            {WORDS.map((word, i) => (
              <div
                key={word}
                ref={(el) => {
                  wordRefs.current[i] = el
                }}
                className="w-full text-center font-sans text-[clamp(2.25rem,10vw,5rem)] leading-[0.92] font-black tracking-tight uppercase will-change-transform"
              >
                {word}
              </div>
            ))}
          </div>

          <div
            ref={outcomeRef}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
          >
            <div ref={systemWrapRef} className="relative flex flex-col items-center gap-3">
              <div
                ref={bubbleLayerRef}
                className="pointer-events-none absolute -inset-24 z-0 md:-inset-32"
                aria-hidden
              >
                {Array.from({ length: BUBBLE_COUNT }, (_, i) => (
                  <span
                    key={`${uid}-b${i}`}
                    className="sys-bubble absolute block size-2 rounded-full bg-primary/45 shadow-sm ring-1 ring-primary/25 md:size-2.5"
                  />
                ))}
              </div>
              <div
                ref={systemRef}
                className="relative z-10 font-sans text-[clamp(2.5rem,11vw,5.25rem)] leading-none font-black tracking-tight uppercase will-change-transform"
              >
                SYSTEM
              </div>
              <p
                className="relative z-10 font-['Caveat',cursive] text-[clamp(1.65rem,5vw,2.35rem)] font-normal leading-snug text-muted-foreground"
                aria-label={TAGLINE}
              >
                {TAGLINE.split("").map((ch, i) => (
                  <span key={`${uid}-t${i}`} className="sys-tag-char inline-block opacity-0">
                    {ch === " " ? "\u00a0" : ch}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-[70vh]" aria-hidden />
    </div>
  )
}

export default SystemConvergence
