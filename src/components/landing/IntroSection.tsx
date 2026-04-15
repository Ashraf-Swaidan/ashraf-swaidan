import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useReducedMotion } from "motion/react"
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"

import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

export type IntroCardTransform = {
  x: number
  y: number
  z: number
  rotateY: number
  rotateX: number
  scale: number
}

type IntroCardKind = "media" | "work" | "design" | "quote" | "stat"

type IntroCardSurface = {
  skewX: number
  skewY: number
  stretchX: number
  stretchY: number
  rotate: number
  origin: string
  radiusClassName?: string
}

type IntroCardInteraction = {
  radius: number
  scatterX: number
  scatterY: number
  liftZ: number
  scaleBoost: number
  followX: number
  followY: number
  rotateX: number
  rotateY: number
}

type IntroCardDef = {
  id: string
  kind: IntroCardKind
  className: string
  origin: IntroCardTransform
  layout: IntroCardTransform
  surface: IntroCardSurface
  interaction: IntroCardInteraction
  panelClass?: string
  badgeClassName?: string
  publishChip?: boolean
}

type IntroControlDef = {
  id: string
  label: string
  ariaLabel: string
  className: string
  outerClassName: string
  innerClassName: string
  contentClassName?: string
  transform: string
}

const INTRO_CARDS: IntroCardDef[] = [
  {
    id: "left-screen",
    kind: "media",
    className: "w-[8rem] sm:w-[10rem] aspect-[4/5]",
    origin: { x: 0, y: 0, z: -36, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: -304, y: -74, z: -124, rotateY: -34, rotateX: 4, scale: 0.82 },
    surface: {
      skewX: -5.8,
      skewY: 1.1,
      stretchX: 0.96,
      stretchY: 1.03,
      rotate: -1.6,
      origin: "82% 45%",
      radiusClassName: "rounded-[1.55rem]",
    },
    interaction: {
      radius: 164,
      scatterX: 13,
      scatterY: 11,
      liftZ: 18,
      scaleBoost: 0.008,
      followX: 2.2,
      followY: 1.8,
      rotateX: 1.4,
      rotateY: 1.8,
    },
    panelClass:
      "bg-[radial-gradient(ellipse_at_18%_65%,rgb(143_167_255_/_0.3),transparent_58%),radial-gradient(ellipse_at_72%_36%,rgb(146_230_205_/_0.22),transparent_62%),linear-gradient(180deg,rgb(23_24_34)_0%,rgb(15_16_24)_100%)]",
    badgeClassName: "right-2.5 top-2",
  },
  {
    id: "bunny-top",
    kind: "media",
    className: "w-[10.4rem] sm:w-[12.8rem] aspect-[5/4]",
    origin: { x: 0, y: 0, z: -24, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: -54, y: -146, z: 38, rotateY: -8, rotateX: 8, scale: 1.01 },
    surface: {
      skewX: -3.2,
      skewY: -1.7,
      stretchX: 1.03,
      stretchY: 1,
      rotate: -1.4,
      origin: "86% 22%",
      radiusClassName: "rounded-[1.8rem]",
    },
    interaction: {
      radius: 172,
      scatterX: 12,
      scatterY: 11,
      liftZ: 20,
      scaleBoost: 0.009,
      followX: 2.2,
      followY: 1.8,
      rotateX: 1.3,
      rotateY: 1.5,
    },
    panelClass:
      "bg-[linear-gradient(180deg,rgb(245_241_239)_0%,rgb(237_231_228)_100%)]",
    badgeClassName: "right-3 top-2.5",
  },
  {
    id: "earth-top-right",
    kind: "media",
    className: "w-[8.7rem] sm:w-[10.8rem] aspect-[4/3]",
    origin: { x: 0, y: 0, z: -18, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: 176, y: -148, z: 12, rotateY: 17, rotateX: 7, scale: 0.93 },
    surface: {
      skewX: 4.9,
      skewY: -1.2,
      stretchX: 0.97,
      stretchY: 1.04,
      rotate: 1.8,
      origin: "18% 40%",
      radiusClassName: "rounded-[1.7rem]",
    },
    interaction: {
      radius: 160,
      scatterX: 12,
      scatterY: 10,
      liftZ: 18,
      scaleBoost: 0.008,
      followX: 2,
      followY: 1.8,
      rotateX: 1.2,
      rotateY: 1.8,
    },
    panelClass:
      "bg-[radial-gradient(circle_at_40%_35%,rgb(208_194_255_/_0.52),transparent_48%),radial-gradient(circle_at_56%_62%,rgb(81_119_189_/_0.4),transparent_66%),linear-gradient(180deg,rgb(28_19_39)_0%,rgb(20_16_30)_100%)]",
    badgeClassName: "right-3 top-2.5",
  },
  {
    id: "publish-tree",
    kind: "media",
    className: "w-[10.8rem] sm:w-[13rem] aspect-[16/10]",
    origin: { x: 0, y: 0, z: -8, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: 88, y: -58, z: 92, rotateY: 7, rotateX: 2, scale: 1.01 },
    surface: {
      skewX: 3.4,
      skewY: -1.1,
      stretchX: 1.05,
      stretchY: 0.985,
      rotate: 1.6,
      origin: "14% 42%",
      radiusClassName: "rounded-[1.8rem]",
    },
    interaction: {
      radius: 170,
      scatterX: 13,
      scatterY: 11,
      liftZ: 24,
      scaleBoost: 0.01,
      followX: 2.2,
      followY: 2,
      rotateX: 1.2,
      rotateY: 1.6,
    },
    panelClass:
      "bg-[radial-gradient(ellipse_at_52%_48%,rgb(254_202_141_/_0.95),transparent_32%),linear-gradient(180deg,rgb(244_237_229)_0%,rgb(238_228_216)_100%)]",
    badgeClassName: "right-3 top-2.5",
    publishChip: true,
  },
  {
    id: "right-slab",
    kind: "media",
    className: "w-[3.6rem] sm:w-[4.4rem] aspect-[9/26]",
    origin: { x: 0, y: 0, z: -2, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: 302, y: -30, z: -92, rotateY: 29, rotateX: 2, scale: 0.82 },
    surface: {
      skewX: 4.1,
      skewY: 0,
      stretchX: 0.94,
      stretchY: 1.02,
      rotate: 1.8,
      origin: "16% 50%",
      radiusClassName: "rounded-[1.45rem]",
    },
    interaction: {
      radius: 138,
      scatterX: 8,
      scatterY: 9,
      liftZ: 14,
      scaleBoost: 0.006,
      followX: 1.6,
      followY: 1.8,
      rotateX: 1.2,
      rotateY: 1.5,
    },
    panelClass:
      "bg-[linear-gradient(180deg,rgb(39_42_56)_0%,rgb(17_18_28)_100%)] before:absolute before:inset-y-[18%] before:left-[42%] before:w-[15%] before:rounded-full before:bg-gradient-to-b before:from-white/45 before:to-transparent",
    badgeClassName: "right-1.5 top-1.5",
  },
  {
    id: "balloons-left-bottom",
    kind: "media",
    className: "w-[10.2rem] sm:w-[12.5rem] aspect-[11/12]",
    origin: { x: 0, y: 0, z: 8, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: -206, y: 90, z: 42, rotateY: -21, rotateX: -6, scale: 1.01 },
    surface: {
      skewX: -4.3,
      skewY: 1.4,
      stretchX: 0.97,
      stretchY: 1.03,
      rotate: -1.8,
      origin: "82% 30%",
      radiusClassName: "rounded-[1.75rem]",
    },
    interaction: {
      radius: 178,
      scatterX: 14,
      scatterY: 13,
      liftZ: 22,
      scaleBoost: 0.01,
      followX: 2.4,
      followY: 2,
      rotateX: 1.4,
      rotateY: 1.8,
    },
    panelClass:
      "bg-[radial-gradient(circle_at_24%_34%,rgb(255_255_255)_0%,rgb(245_245_245)_16%,transparent_20%),radial-gradient(circle_at_46%_28%,rgb(255_123_123)_0%,rgb(255_123_123)_15%,transparent_18%),radial-gradient(circle_at_62%_52%,rgb(255_255_255)_0%,rgb(244_244_244)_16%,transparent_20%),radial-gradient(circle_at_74%_26%,rgb(250_166_166)_0%,rgb(250_166_166)_13%,transparent_16%),linear-gradient(180deg,rgb(246_243_242)_0%,rgb(239_233_230)_100%)]",
    badgeClassName: "left-3 top-3",
  },
  {
    id: "nebula-center-bottom",
    kind: "media",
    className: "w-[9rem] sm:w-[11.2rem] aspect-[11/12]",
    origin: { x: 0, y: 0, z: 16, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: 4, y: 106, z: 68, rotateY: -3, rotateX: -5, scale: 1.01 },
    surface: {
      skewX: -2,
      skewY: 0.9,
      stretchX: 1.03,
      stretchY: 1.02,
      rotate: -0.8,
      origin: "54% 42%",
      radiusClassName: "rounded-[1.8rem]",
    },
    interaction: {
      radius: 170,
      scatterX: 13,
      scatterY: 12,
      liftZ: 24,
      scaleBoost: 0.01,
      followX: 2.2,
      followY: 2.1,
      rotateX: 1.3,
      rotateY: 1.3,
    },
    panelClass:
      "bg-[radial-gradient(circle_at_50%_50%,rgb(255_220_240_/_0.78)_0%,rgb(227_179_206_/_0.4)_22%,transparent_48%),radial-gradient(circle_at_44%_48%,rgb(255_255_255_/_0.42)_0%,transparent_40%),linear-gradient(180deg,rgb(23_15_31)_0%,rgb(15_11_23)_100%)]",
    badgeClassName: "left-1/2 top-3 -translate-x-1/2",
  },
  {
    id: "dna-right-bottom",
    kind: "media",
    className: "w-[4.95rem] sm:w-[6.15rem] aspect-[11/26]",
    origin: { x: 0, y: 0, z: 24, rotateY: 0, rotateX: 0, scale: 0.72 },
    layout: { x: 216, y: 114, z: 34, rotateY: 16, rotateX: -4, scale: 0.95 },
    surface: {
      skewX: -7.2,
      skewY: 0.5,
      stretchX: 1.18,
      stretchY: 1,
      rotate: -2.2,
      origin: "100% 50%",
      radiusClassName: "rounded-[1.5rem]",
    },
    interaction: {
      radius: 146,
      scatterX: 10,
      scatterY: 10,
      liftZ: 16,
      scaleBoost: 0.007,
      followX: 1.8,
      followY: 1.8,
      rotateX: 1.2,
      rotateY: 1.6,
    },
    panelClass:
      "bg-[repeating-linear-gradient(158deg,rgb(117_234_255)_0_7%,rgb(250_132_186)_7%_14%,rgb(255_227_132)_14%_21%,rgb(132_143_255)_21%_28%)]",
    badgeClassName: "left-2 top-2",
  },
]

const INTRO_CONTROLS: IntroControlDef[] = [
  {
    id: "share",
    label: "Share",
    ariaLabel: "Share project",
    className: "left-[7%] top-[42%]",
    outerClassName:
      "rounded-full bg-[#183771]/95 px-[0.22rem] py-[0.18rem] shadow-[0_18px_44px_-26px_rgb(9_18_37/0.88)] ring-1 ring-[#4c6bb5]/28",
    innerClassName:
      "rounded-full bg-[#183771] px-4 py-2 text-[0.76rem] font-semibold tracking-[-0.03em] text-[#dae8ff] transition duration-300 group-hover:-translate-y-[1px] group-hover:bg-[#21458b]",
    transform: "translateZ(332px) rotate(-4deg)",
  },
  {
    id: "set",
    label: "SET",
    ariaLabel: "Selected works hub",
    className: "left-1/2 top-[2.6%] -translate-x-1/2",
    outerClassName:
      "rounded-full bg-zinc-900/94 px-[0.2rem] py-[0.2rem] shadow-[0_16px_38px_-24px_rgb(0_0_0/0.92)] ring-1 ring-white/10",
    innerClassName:
      "rounded-full bg-zinc-900 px-4 py-3 text-[0.84rem] font-semibold tracking-[-0.04em] text-zinc-100 transition duration-300 group-hover:scale-[1.02] group-hover:bg-zinc-800",
    transform: "translateZ(340px) rotate(1deg)",
  },
  {
    id: "plus",
    label: "+",
    ariaLabel: "Open quick action",
    className: "bottom-[8%] left-[11%]",
    outerClassName:
      "rounded-full bg-white/8 p-[0.16rem] shadow-[0_18px_36px_-24px_rgb(0_0_0/0.9)] ring-1 ring-white/12 backdrop-blur-md",
    innerClassName:
      "flex size-12 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-zinc-100 transition duration-300 group-hover:scale-[1.04] group-hover:bg-white/14",
    contentClassName: "leading-none",
    transform: "translateZ(346px) rotate(-6deg)",
  },
  {
    id: "open",
    label: "Open",
    ariaLabel: "Open selected work",
    className: "bottom-[13.5%] left-1/2 -translate-x-1/2",
    outerClassName:
      "rounded-full bg-white/10 px-[0.2rem] py-[0.2rem] shadow-[0_18px_40px_-24px_rgb(0_0_0/0.92)] ring-1 ring-white/14 backdrop-blur-md",
    innerClassName:
      "rounded-full bg-zinc-900/92 px-6 py-2.5 text-[0.84rem] font-semibold tracking-[-0.03em] text-white transition duration-300 group-hover:-translate-y-[1px] group-hover:bg-zinc-800",
    transform: "translateZ(348px) rotate(-2deg)",
  },
  {
    id: "explore",
    label: "Explore",
    ariaLabel: "Explore more work",
    className: "bottom-[7.5%] right-[9%]",
    outerClassName:
      "rounded-full bg-white/9 px-[0.2rem] py-[0.2rem] shadow-[0_18px_40px_-24px_rgb(0_0_0/0.92)] ring-1 ring-white/14 backdrop-blur-md",
    innerClassName:
      "rounded-full bg-zinc-900/94 px-5 py-2.5 text-[0.82rem] font-semibold tracking-[-0.03em] text-zinc-100 transition duration-300 group-hover:-translate-y-[1px] group-hover:bg-zinc-800",
    transform: "translateZ(344px) rotate(2deg)",
  },
]

function kindLabel(kind: IntroCardKind): string {
  switch (kind) {
    case "work":
      return "Work"
    case "design":
      return "Design"
    case "quote":
      return "Quote"
    case "stat":
      return "Stat"
    default:
      return "Media"
  }
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

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
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const controlRefs = useRef<(HTMLButtonElement | null)[]>([])
  const scatterDoneRef = useRef(false)

  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = Boolean(prefersReducedMotion)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useGSAP(
    () => {
      const field = fieldRef.current
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[]
      const controls = controlRefs.current.filter(
        Boolean
      ) as HTMLButtonElement[]

      if (!field || cards.length === 0) return

      scatterDoneRef.current = false

      const ctx = gsap.context(() => {
        if (reduceMotion) {
          cards.forEach((el, index) => {
            const def = INTRO_CARDS[index]
            if (!def) return
            gsap.set(el, { autoAlpha: 1 })
            applyCardTransform(el, def.layout)
          })
          gsap.set(controls, { autoAlpha: 1, scale: 1 })
          scatterDoneRef.current = true
          return
        }

        cards.forEach((el, index) => {
          const def = INTRO_CARDS[index]
          if (!def) return
          gsap.set(el, { autoAlpha: 0.84 })
          applyCardTransform(el, def.origin)
        })

        gsap.set(controls, { autoAlpha: 0, y: 10, scale: 0.94 })

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            scatterDoneRef.current = true
          },
        })

        tl.to(
          cards,
          {
            x: (index) => INTRO_CARDS[index]!.layout.x,
            y: (index) => INTRO_CARDS[index]!.layout.y,
            z: (index) => INTRO_CARDS[index]!.layout.z,
            rotationY: (index) => INTRO_CARDS[index]!.layout.rotateY,
            rotationX: (index) => INTRO_CARDS[index]!.layout.rotateX,
            scale: (index) => INTRO_CARDS[index]!.layout.scale,
            autoAlpha: 1,
            duration: 1,
            ease: "power4.out",
            stagger: { amount: 0.32, from: "center" },
          },
          0.02
        )

        tl.to(
          controls,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
            stagger: 0.04,
          },
          "-=0.42"
        )
      }, field)

      return () => {
        gsap.killTweensOf(cards)
        ctx.revert()
        scatterDoneRef.current = false
      }
    },
    {
      scope: rootRef,
      dependencies: [reduceMotion],
      revertOnUpdate: true,
    }
  )

  const onCardClick = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id))
  }

  const onCardKeyDown = (e: ReactKeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onCardClick(id)
    }
  }

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
        className="pointer-events-none absolute inset-0 opacity-[0.88]"
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

      <div className="relative z-[1] flex min-h-svh flex-col items-center justify-center px-4 pt-14 pb-10 sm:px-6 sm:pt-16">
        <p
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
            className="relative h-[min(560px,66vh)] w-full max-w-[min(100%,48rem)] sm:h-[min(620px,70vh)] sm:max-w-[49rem]"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(1.4deg) rotateZ(-0.4deg)",
            }}
          >
            {INTRO_CARDS.map((card, index) => {
              const selected = activeId === card.id
              const hovered = hoveredId === card.id

              return (
                <article
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`${kindLabel(card.kind)} card: ${card.id}. Press to focus.`}
                  onClick={() => onCardClick(card.id)}
                  onKeyDown={(e) => onCardKeyDown(e, card.id)}
                  onMouseEnter={() => setHoveredId(card.id)}
                  onMouseLeave={() =>
                    setHoveredId((prev) => (prev === card.id ? null : prev))
                  }
                  onFocus={() => setHoveredId(card.id)}
                  onBlur={() =>
                    setHoveredId((prev) => (prev === card.id ? null : prev))
                  }
                  className={cn(
                    "absolute cursor-pointer will-change-transform [transform-style:preserve-3d]",
                    "focus-visible:z-[40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(231_148_255)]/80",
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
                        "relative h-full w-full overflow-hidden ring-1 ring-white/[0.17]",
                        "shadow-[0_26px_68px_-28px_rgb(0_0_0/0.84)] transition-[box-shadow,filter,ring-color] duration-300",
                        hovered &&
                          "shadow-[0_34px_86px_-28px_rgb(0_0_0/0.9)] ring-white/[0.26] saturate-[1.05]",
                        selected &&
                          "shadow-[0_38px_92px_-30px_rgb(14_6_20/0.95)] ring-[rgb(231_148_255)]/48",
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
                        className="relative flex h-full w-full flex-col justify-between px-3 pt-3 pb-3 sm:px-3.5 sm:pt-3.5 sm:pb-3.5"
                        style={getSurfaceContentStyle(card.surface)}
                      >
                        <span
                          className={cn(
                            "absolute z-[3] rounded-[0.55rem] bg-black/48 px-1.5 py-[0.22rem] text-[0.56rem] font-medium tracking-[0.06em] text-white/78 uppercase ring-1 ring-white/15",
                            card.badgeClassName ?? "top-2.5 right-2.5"
                          )}
                          style={{ fontFamily: "var(--font-hero-intro)" }}
                        >
                          {card.id}
                        </span>

                        {card.publishChip ? (
                          <span
                            className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-zinc-900 shadow-[0_10px_22px_-18px_rgb(0_0_0/0.6)]"
                            style={{ fontFamily: "var(--font-hero-intro)" }}
                          >
                            <GlobeIcon className="size-3.5 text-zinc-900" />
                            Publish
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}

            <div
              className="pointer-events-none absolute inset-0 z-[90]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {INTRO_CONTROLS.map((control, index) => (
                <button
                  key={control.id}
                  ref={(el) => {
                    controlRefs.current[index] = el
                  }}
                  type="button"
                  aria-label={control.ariaLabel}
                  className={cn(
                    "group pointer-events-auto absolute transition-transform duration-300 hover:scale-[1.015]",
                    control.className
                  )}
                >
                  <span
                    className="block will-change-transform"
                    style={{ transform: control.transform }}
                  >
                    <span className={cn("block", control.outerClassName)}>
                      <span
                        className={cn(
                          "block [transform:skewX(-8deg)_scaleX(0.97)]",
                          control.innerClassName
                        )}
                      >
                        <span
                          className={cn(
                            "block [transform:skewX(8deg)]",
                            control.contentClassName
                          )}
                          style={{ fontFamily: "var(--font-hero-intro)" }}
                        >
                          {control.label}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p
          className="mt-8 max-w-md text-center text-[0.8rem] leading-relaxed text-zinc-600"
          style={{ fontFamily: "var(--font-hero-quote)" }}
        >
          Placeholder tiles - swap in real projects, renders, and copy when
          you&apos;re ready.
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />
    </section>
  )
}
