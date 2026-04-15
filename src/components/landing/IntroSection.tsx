import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "motion/react"
import { useRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type IntroCardTransform = {
  x: number
  y: number
  z: number
  rotateY: number
  rotateX: number
  scale: number
  autoAlpha: number
}

type IntroCardSurface = {
  skewX: number
  skewY: number
  stretchX: number
  stretchY: number
  rotate: number
  origin: string
  radiusClassName?: string
}

type IntroCardDef = {
  id: string
  className: string
  stacked: IntroCardTransform
  skewed: IntroCardTransform
  collapse: IntroCardTransform
  surface: IntroCardSurface
  panelClass?: string
}

const INTRO_QUOTE = "YOU CAN JUST DO THINGS"
const INTRO_PIN_DISTANCE_FACTOR = 3.2
const INTRO_CARET_HEIGHT_RATIO = 1
const INTRO_FIELD_SCALE = 1.2
const INTRO_FIELD_SCALE_MOBILE = 1.02

const INTRO_STAGE_DURATIONS = {
  stacked: 18,
  skewed: 30,
  collapse: 26,
  typing: 26,
} as const

const INTRO_CARDS: IntroCardDef[] = [
  {
    id: "left-screen",
    className: "w-[8rem] sm:w-[10rem] aspect-[4/5]",
    stacked: {
      x: -112,
      y: -36,
      z: -54,
      rotateY: -18,
      rotateX: 6,
      scale: 0.78,
      autoAlpha: 1,
    },
    skewed: {
      x: -304,
      y: -74,
      z: -124,
      rotateY: -34,
      rotateX: 4,
      scale: 0.82,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: -112,
      z: 16,
      rotateY: 0,
      rotateX: 0,
      scale: 0.38,
      autoAlpha: 0.18,
    },
    surface: {
      skewX: -5.8,
      skewY: 1.1,
      stretchX: 0.96,
      stretchY: 1.03,
      rotate: -1.6,
      origin: "82% 45%",
      radiusClassName: "rounded-[1.55rem]",
    },
    panelClass:
      "bg-[radial-gradient(ellipse_at_18%_65%,rgb(143_167_255_/_0.3),transparent_58%),radial-gradient(ellipse_at_72%_36%,rgb(146_230_205_/_0.22),transparent_62%),linear-gradient(180deg,rgb(23_24_34)_0%,rgb(15_16_24)_100%)]",
  },
  {
    id: "bunny-top",
    className: "w-[10.4rem] sm:w-[12.8rem] aspect-[5/4]",
    stacked: {
      x: -34,
      y: -118,
      z: 46,
      rotateY: -4,
      rotateX: 9,
      scale: 0.96,
      autoAlpha: 1,
    },
    skewed: {
      x: -54,
      y: -146,
      z: 38,
      rotateY: -8,
      rotateX: 8,
      scale: 1.01,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: -80,
      z: 12,
      rotateY: 0,
      rotateX: 0,
      scale: 0.46,
      autoAlpha: 0.24,
    },
    surface: {
      skewX: -3.2,
      skewY: -1.7,
      stretchX: 1.03,
      stretchY: 1,
      rotate: -1.4,
      origin: "86% 22%",
      radiusClassName: "rounded-[1.8rem]",
    },
    panelClass:
      "bg-[linear-gradient(180deg,rgb(245_241_239)_0%,rgb(237_231_228)_100%)]",
  },
  {
    id: "earth-top-right",
    className: "w-[8.7rem] sm:w-[10.8rem] aspect-[4/3]",
    stacked: {
      x: 96,
      y: -92,
      z: 18,
      rotateY: 12,
      rotateX: 8,
      scale: 0.84,
      autoAlpha: 1,
    },
    skewed: {
      x: 176,
      y: -148,
      z: 12,
      rotateY: 17,
      rotateX: 7,
      scale: 0.93,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: -46,
      z: 9,
      rotateY: 0,
      rotateX: 0,
      scale: 0.34,
      autoAlpha: 0.16,
    },
    surface: {
      skewX: 4.9,
      skewY: -1.2,
      stretchX: 0.97,
      stretchY: 1.04,
      rotate: 1.8,
      origin: "18% 40%",
      radiusClassName: "rounded-[1.7rem]",
    },
    panelClass:
      "bg-[radial-gradient(circle_at_40%_35%,rgb(208_194_255_/_0.52),transparent_48%),radial-gradient(circle_at_56%_62%,rgb(81_119_189_/_0.4),transparent_66%),linear-gradient(180deg,rgb(28_19_39)_0%,rgb(20_16_30)_100%)]",
  },
  {
    id: "publish-tree",
    className: "w-[10.8rem] sm:w-[13rem] aspect-[16/10]",
    stacked: {
      x: 36,
      y: -10,
      z: 80,
      rotateY: 7,
      rotateX: 3,
      scale: 0.93,
      autoAlpha: 1,
    },
    skewed: {
      x: 88,
      y: -58,
      z: 92,
      rotateY: 7,
      rotateX: 2,
      scale: 1.01,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: -12,
      z: 6,
      rotateY: 0,
      rotateX: 0,
      scale: 0.42,
      autoAlpha: 0.22,
    },
    surface: {
      skewX: 3.4,
      skewY: -1.1,
      stretchX: 1.05,
      stretchY: 0.985,
      rotate: 1.6,
      origin: "14% 42%",
      radiusClassName: "rounded-[1.8rem]",
    },
    panelClass:
      "bg-[radial-gradient(ellipse_at_52%_48%,rgb(254_202_141_/_0.95),transparent_32%),linear-gradient(180deg,rgb(244_237_229)_0%,rgb(238_228_216)_100%)]",
  },
  {
    id: "right-slab",
    className: "w-[3.6rem] sm:w-[4.4rem] aspect-[9/26]",
    stacked: {
      x: 130,
      y: 6,
      z: -60,
      rotateY: 18,
      rotateX: 1,
      scale: 0.72,
      autoAlpha: 1,
    },
    skewed: {
      x: 302,
      y: -30,
      z: -92,
      rotateY: 29,
      rotateX: 2,
      scale: 0.82,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: 22,
      z: 4,
      rotateY: 0,
      rotateX: 0,
      scale: 0.3,
      autoAlpha: 0.14,
    },
    surface: {
      skewX: 4.1,
      skewY: 0,
      stretchX: 0.94,
      stretchY: 1.02,
      rotate: 1.8,
      origin: "16% 50%",
      radiusClassName: "rounded-[1.45rem]",
    },
    panelClass:
      "bg-[linear-gradient(180deg,rgb(39_42_56)_0%,rgb(17_18_28)_100%)] before:absolute before:inset-y-[18%] before:left-[42%] before:w-[15%] before:rounded-full before:bg-gradient-to-b before:from-white/45 before:to-transparent",
  },
  {
    id: "balloons-left-bottom",
    className: "w-[10.2rem] sm:w-[12.5rem] aspect-[11/12]",
    stacked: {
      x: -102,
      y: 82,
      z: 18,
      rotateY: -16,
      rotateX: -4,
      scale: 0.88,
      autoAlpha: 1,
    },
    skewed: {
      x: -206,
      y: 90,
      z: 42,
      rotateY: -21,
      rotateX: -6,
      scale: 1.01,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: 54,
      z: 2,
      rotateY: 0,
      rotateX: 0,
      scale: 0.45,
      autoAlpha: 0.2,
    },
    surface: {
      skewX: -4.3,
      skewY: 1.4,
      stretchX: 0.97,
      stretchY: 1.03,
      rotate: -1.8,
      origin: "82% 30%",
      radiusClassName: "rounded-[1.75rem]",
    },
    panelClass:
      "bg-[radial-gradient(circle_at_24%_34%,rgb(255_255_255)_0%,rgb(245_245_245)_16%,transparent_20%),radial-gradient(circle_at_46%_28%,rgb(255_123_123)_0%,rgb(255_123_123)_15%,transparent_18%),radial-gradient(circle_at_62%_52%,rgb(255_255_255)_0%,rgb(244_244_244)_16%,transparent_20%),radial-gradient(circle_at_74%_26%,rgb(250_166_166)_0%,rgb(250_166_166)_13%,transparent_16%),linear-gradient(180deg,rgb(246_243_242)_0%,rgb(239_233_230)_100%)]",
  },
  {
    id: "nebula-center-bottom",
    className: "w-[9rem] sm:w-[11.2rem] aspect-[11/12]",
    stacked: {
      x: -2,
      y: 106,
      z: 58,
      rotateY: -2,
      rotateX: -4,
      scale: 0.9,
      autoAlpha: 1,
    },
    skewed: {
      x: 4,
      y: 106,
      z: 68,
      rotateY: -3,
      rotateX: -5,
      scale: 1.01,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: 90,
      z: 1,
      rotateY: 0,
      rotateX: 0,
      scale: 0.4,
      autoAlpha: 0.18,
    },
    surface: {
      skewX: -2,
      skewY: 0.9,
      stretchX: 1.03,
      stretchY: 1.02,
      rotate: -0.8,
      origin: "54% 42%",
      radiusClassName: "rounded-[1.8rem]",
    },
    panelClass:
      "bg-[radial-gradient(circle_at_50%_50%,rgb(255_220_240_/_0.78)_0%,rgb(227_179_206_/_0.4)_22%,transparent_48%),radial-gradient(circle_at_44%_48%,rgb(255_255_255_/_0.42)_0%,transparent_40%),linear-gradient(180deg,rgb(23_15_31)_0%,rgb(15_11_23)_100%)]",
  },
  {
    id: "dna-right-bottom",
    className: "w-[4.95rem] sm:w-[6.15rem] aspect-[11/26]",
    stacked: {
      x: 94,
      y: 92,
      z: -4,
      rotateY: 10,
      rotateX: -3,
      scale: 0.8,
      autoAlpha: 1,
    },
    skewed: {
      x: 216,
      y: 114,
      z: 34,
      rotateY: 16,
      rotateX: -4,
      scale: 0.95,
      autoAlpha: 1,
    },
    collapse: {
      x: 0,
      y: 126,
      z: 0,
      rotateY: 0,
      rotateX: 0,
      scale: 0.34,
      autoAlpha: 0.15,
    },
    surface: {
      skewX: -7.2,
      skewY: 0.5,
      stretchX: 1.18,
      stretchY: 1,
      rotate: -2.2,
      origin: "100% 50%",
      radiusClassName: "rounded-[1.5rem]",
    },
    panelClass:
      "bg-[repeating-linear-gradient(158deg,rgb(117_234_255)_0_7%,rgb(250_132_186)_7%_14%,rgb(255_227_132)_14%_21%,rgb(132_143_255)_21%_28%)]",
  },
]

function applyCardTransform(el: HTMLElement, t: IntroCardTransform) {
  gsap.set(el, {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    x: t.x,
    y: t.y,
    z: t.z,
    rotationY: t.rotateY,
    rotationX: t.rotateX,
    scale: t.scale,
    scaleX: 1,
    scaleY: 1,
    autoAlpha: t.autoAlpha,
    transformOrigin: "50% 50%",
    force3D: true,
  })
}

function getSurfaceStyle(surface: IntroCardSurface): CSSProperties {
  return {
    transform: `translateZ(0.1px) rotate(${surface.rotate}deg) skewX(${surface.skewX}deg) skewY(${surface.skewY}deg) scale(${surface.stretchX}, ${surface.stretchY})`,
    transformOrigin: surface.origin,
  }
}

function getSurfaceContentStyle(surface: IntroCardSurface): CSSProperties {
  const scaleX = 1 + (1 - surface.stretchX) * 0.72
  const scaleY = 1 + (1 - surface.stretchY) * 0.72

  return {
    transform: `translateZ(1px) rotate(${surface.rotate * -0.35}deg) skewX(${surface.skewX * -0.92}deg) skewY(${surface.skewY * -0.92}deg) scale(${scaleX}, ${scaleY})`,
    transformOrigin: surface.origin,
  }
}

export function IntroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const typingPanelRef = useRef<HTMLDivElement>(null)
  const quoteRowRef = useRef<HTMLDivElement>(null)
  const quoteTextRef = useRef<HTMLSpanElement>(null)
  const quoteMeasureRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)

  useGSAP(
    () => {
      const root = rootRef.current
      const field = fieldRef.current
      const eyebrow = eyebrowRef.current
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[]
      const typingPanel = typingPanelRef.current
      const quoteRow = quoteRowRef.current
      const quoteText = quoteTextRef.current
      const quoteMeasure = quoteMeasureRef.current
      const caret = caretRef.current

      if (
        !root ||
        !field ||
        !eyebrow ||
        !typingPanel ||
        !quoteRow ||
        !quoteText ||
        !quoteMeasure ||
        !caret
      ) {
        return
      }

      let quoteWidth = 0
      let charWidths: number[] = []
      let caretBlinkTween: gsap.core.Tween | null = null
      const getFieldScale = () =>
        window.innerWidth < 640 ? INTRO_FIELD_SCALE_MOBILE : INTRO_FIELD_SCALE

      const syncQuoteMetrics = () => {
        gsap.set(field, {
          scale: getFieldScale(),
          transformOrigin: "50% 50%",
        })
        charWidths = [0]
        quoteMeasure.textContent = ""
        for (let i = 1; i <= INTRO_QUOTE.length; i += 1) {
          quoteMeasure.textContent = INTRO_QUOTE.slice(0, i)
          charWidths[i] = quoteMeasure.scrollWidth
        }
        quoteMeasure.textContent = INTRO_QUOTE
        quoteWidth = charWidths[INTRO_QUOTE.length] ?? quoteMeasure.scrollWidth
        const quoteHeight = quoteText.getBoundingClientRect().height || 96
        const caretHeight = Math.min(
          Math.max(quoteHeight * 0.94, 46),
          quoteHeight * 1.18
        ) * INTRO_CARET_HEIGHT_RATIO
        const caretWidth = Math.min(Math.max(quoteHeight * 0.12, 8), 20)
        gsap.set(caret, {
          width: caretWidth,
          height: caretHeight,
          borderRadius: Math.max(caretWidth / 2, 6),
        })
      }

      const ctx = gsap.context(() => {
        syncQuoteMetrics()

        if (reduceMotion) {
          gsap.set(field, {
            scale: getFieldScale(),
            transformOrigin: "50% 50%",
          })
          cards.forEach((el, index) => {
            const def = INTRO_CARDS[index]
            if (!def) return
            applyCardTransform(el, {
              ...def.collapse,
              autoAlpha: 0,
            })
          })
          gsap.set(eyebrow, { autoAlpha: 0 })
          gsap.set(typingPanel, { autoAlpha: 1, scale: 1 })
          gsap.set(quoteRow, { autoAlpha: 1 })
          gsap.set(quoteText, { textContent: INTRO_QUOTE })
          gsap.set(caret, {
            autoAlpha: 1,
            scale: 1,
            x: quoteWidth,
            xPercent: -50,
            opacity: 1,
            transformOrigin: "50% 50%",
          })
          return
        }

        cards.forEach((el, index) => {
          const def = INTRO_CARDS[index]
          if (!def) return
          applyCardTransform(el, def.stacked)
        })

        gsap.set(field, {
          rotateX: 1.4,
          rotateZ: -0.4,
          scale: getFieldScale(),
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        })
        gsap.set(eyebrow, { autoAlpha: 1, y: 0 })
        gsap.set(typingPanel, {
          autoAlpha: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        })
        gsap.set(quoteRow, { autoAlpha: 1 })
          gsap.set(quoteText, { textContent: "" })
        gsap.set(caret, {
          autoAlpha: 0,
          x: 0,
          xPercent: -50,
          scaleX: 0.42,
          scaleY: 0.82,
          rotate: 0,
          opacity: 1,
          transformOrigin: "50% 50%",
        })

        caretBlinkTween = gsap.to(caret, {
          opacity: 0.28,
          duration: 0.55,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        })

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () =>
              `+=${Math.max(window.innerHeight * INTRO_PIN_DISTANCE_FACTOR, 2200)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: syncQuoteMetrics,
            onUpdate: (self) => {
              if (!caretBlinkTween) return

              if (self.progress > 0.9) {
                if (!caretBlinkTween.isActive()) caretBlinkTween.play()
              } else {
                caretBlinkTween.pause(0)
              }
            },
          },
        })

        timeline.to({}, { duration: INTRO_STAGE_DURATIONS.stacked })

        timeline.to(
          cards,
          {
            x: (index) => INTRO_CARDS[index]!.skewed.x,
            y: (index) => INTRO_CARDS[index]!.skewed.y,
            z: (index) => INTRO_CARDS[index]!.skewed.z,
            rotationY: (index) => INTRO_CARDS[index]!.skewed.rotateY,
            rotationX: (index) => INTRO_CARDS[index]!.skewed.rotateX,
            scale: (index) => INTRO_CARDS[index]!.skewed.scale,
            autoAlpha: (index) => INTRO_CARDS[index]!.skewed.autoAlpha,
            duration: INTRO_STAGE_DURATIONS.skewed,
            stagger: { amount: 6, from: "center" },
          },
          INTRO_STAGE_DURATIONS.stacked
        )

        timeline.to(
          eyebrow,
          {
            autoAlpha: 0,
            y: -12,
            duration: 8,
            ease: "power1.out",
          },
          INTRO_STAGE_DURATIONS.stacked + INTRO_STAGE_DURATIONS.skewed * 0.84
        )

        const collapseStart =
        INTRO_STAGE_DURATIONS.stacked + INTRO_STAGE_DURATIONS.skewed
      const collapseDuration = INTRO_STAGE_DURATIONS.collapse

      // Fade in the typing panel slightly before the implode finishes
      timeline.to(
        typingPanel,
        {
          autoAlpha: 1,
          duration: INTRO_STAGE_DURATIONS.collapse * 0.34,
          ease: "power2.out",
        },
        collapseStart + 1.2
      )

      // PHASE 1: Pull everything to the centerline, start crushing width
      timeline.to(
        cards,
        {
          x: 0,
          y: 0,
          z: 0,
          rotationY: 0,
          rotationX: 0,
          scaleX: 0.06,
          scaleY: 0.6,
          autoAlpha: 0.85,
          duration: collapseDuration * 0.7,
          ease: "power2.inOut",
          stagger: { amount: 4, from: "center" },
        },
        collapseStart
      )

      // PHASE 2: Final snap - all cards become one vertical line simultaneously
      timeline.to(
        cards,
        {
          scaleX: 0.012,
          scaleY: 1.4,
          autoAlpha: 1,
          duration: collapseDuration * 0.22,
          ease: "power3.in",
          stagger: 0,
        },
        collapseStart + collapseDuration * 0.7
      )

      // PHASE 3: White flash dissolve - line expands vertically then vanishes
      timeline.to(
        cards,
        {
          autoAlpha: 0,
          scaleY: 2.2,
          duration: collapseDuration * 0.06,
          ease: "power4.out",
          stagger: 0,
        },
        collapseStart + collapseDuration * 0.92
      )

      // Hard hide after flash
      timeline.set(
        cards,
        { visibility: "hidden" },
        collapseStart + collapseDuration
      )

      // THE CARET HANDOFF — caret is already at full size; just fade it in
      // as the cards reach their thinnest point so they appear to BECOME the cursor
      timeline.to(
        caret,
        {
          autoAlpha: 1,
          scaleX: 0.42,
          scaleY: 0.82,
          duration: collapseDuration * 0.1,
          ease: "power1.out",
        },
        collapseStart + collapseDuration * 0.74
      )

      timeline.to(
        caret,
        {
          scaleX: 1.12,
          scaleY: 1,
          duration: collapseDuration * 0.14,
          ease: "power2.out",
        },
        collapseStart + collapseDuration * 0.84
      )

      timeline.to(
        caret,
        {
          scaleX: 1,
          scaleY: 1,
          duration: collapseDuration * 0.06,
          ease: "sine.out",
        },
        collapseStart + collapseDuration * 0.98
      )

        const typingStart = collapseStart + INTRO_STAGE_DURATIONS.collapse

        timeline.to(
          caret,
          {
            scale: 1.02,
            rotate: 0.4,
            duration: 1.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          typingStart + 0.25
        )

        const typedState = { count: 0 }
        timeline.to(
          typedState,
          {
            count: INTRO_QUOTE.length,
            duration: INTRO_STAGE_DURATIONS.typing * 0.82,
            ease: `steps(${INTRO_QUOTE.length})`,
            onUpdate: () => {
              const count = Math.min(
                INTRO_QUOTE.length,
                Math.max(0, Math.round(typedState.count))
              )
              quoteText.textContent = INTRO_QUOTE.slice(0, count)
              gsap.set(caret, { x: charWidths[count] ?? quoteWidth })
            },
          },
          typingStart + 1.45
        )

        timeline.to(
          caret,
          {
            x: () => quoteWidth,
            duration: 0.22,
            ease: "power1.out",
          },
          typingStart + 1.45 + INTRO_STAGE_DURATIONS.typing * 0.82
        )

        if ("fonts" in document) {
          void document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      }, root)

      return () => {
        caretBlinkTween?.kill()
        ctx.revert()
      }
    },
    {
      scope: rootRef,
      dependencies: [reduceMotion],
      revertOnUpdate: true,
    }
  )

  return (
    <section
      ref={rootRef}
      aria-label="Portfolio introduction"
      className={cn(
        "relative isolate min-h-svh overflow-hidden bg-black text-zinc-100",
        "selection:bg-[rgb(231_148_255)]/35 selection:text-white"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.9]"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 86% 60% at 50% 42%, rgb(36 0 43 / 0.58) 0%, transparent 56%),
            radial-gradient(ellipse 52% 42% at 69% 29%, rgb(214 132 255 / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 44% 34% at 24% 70%, rgb(232 166 114 / 0.07) 0%, transparent 44%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-[1] flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <p
          ref={eyebrowRef}
          className="mb-6 max-w-xl text-center text-[0.72rem] font-medium tracking-[0.28em] text-zinc-500 uppercase sm:text-[0.75rem]"
          style={{ fontFamily: "var(--font-hero-intro)" }}
        >
          Selected works - design - motion
        </p>

        <div
          className="relative flex w-full max-w-6xl flex-1 items-center justify-center"
          style={{ perspective: "min(1440px, 112vw)" }}
        >
          <div
            ref={fieldRef}
            className="relative h-[min(620px,72vh)] w-full max-w-[min(100%,56rem)] sm:h-[min(700px,76vh)] sm:max-w-[58rem]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {INTRO_CARDS.map((card, index) => (
              <article
                key={card.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                aria-hidden
                className={cn(
                  "pointer-events-none absolute will-change-[transform,opacity] [transform-style:preserve-3d]",
                  card.className
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 [transform-style:preserve-3d]",
                    card.surface.radiusClassName ?? "rounded-[1.75rem]"
                  )}
                  style={getSurfaceStyle(card.surface)}
                >
                  <div
                    className={cn(
                      "relative h-full w-full overflow-hidden ring-1 ring-white/[0.16]",
                      "shadow-[0_28px_72px_-28px_rgb(0_0_0/0.88)]",
                      card.surface.radiusClassName ?? "rounded-[1.75rem]",
                      card.panelClass ?? "bg-zinc-950/50 backdrop-blur-xl"
                    )}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-75 mix-blend-screen"
                      aria-hidden
                      style={{
                        background:
                          "radial-gradient(circle at 18% 14%, rgb(255 255 255 / 0.22) 0%, transparent 34%), radial-gradient(circle at 82% 12%, rgb(255 255 255 / 0.1) 0%, transparent 28%)",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.22]"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgb(255 255 255 / 0.16) 0%, transparent 24%, transparent 76%, rgb(255 255 255 / 0.04) 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={getSurfaceContentStyle(card.surface)}
                    />
                  </div>
                </div>
              </article>
            ))}

            <div
              ref={typingPanelRef}
              className="pointer-events-none absolute inset-0 z-[72] overflow-visible"
            >
              <div
                ref={quoteRowRef}
                className="absolute top-1/2 left-1/2 z-[80] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white"
              >
                <span
                  ref={quoteTextRef}
                  className="block text-[clamp(1.85rem,7.1vw+0.12rem,9.35rem)] font-semibold tracking-[-0.01em] text-white/98 uppercase"
                  style={{ fontFamily: "var(--font-hero-intro)" }}
                >
                  {INTRO_QUOTE}
                </span>
                <span
                  ref={quoteMeasureRef}
                  className="absolute top-0 left-0 -z-10 block opacity-0 text-[clamp(1.85rem,7.1vw+0.12rem,9.35rem)] font-semibold tracking-[-0.01em] uppercase"
                  style={{ fontFamily: "var(--font-hero-intro)" }}
                  aria-hidden
                >
                  {INTRO_QUOTE}
                </span>
                <span
                  ref={caretRef}
                  className="absolute top-1/2 left-0 block -translate-y-1/2 rounded-full bg-white shadow-[0_0_56px_rgb(255_255_255/0.28)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />
    </section>
  )
}
